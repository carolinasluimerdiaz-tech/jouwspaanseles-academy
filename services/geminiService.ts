
import { GoogleGenAI, Modality, LiveServerMessage, Chat, Type } from "@google/genai";
import { SpeechGenerationResult, LatamCountry, ZayroSummary, LanguageOption } from "../types"; 

function decode(base64: string) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const safeLength = Math.floor(arrayBuffer.byteLength / 2) * 2;
  const dataInt16 = new Int16Array(arrayBuffer, 0, safeLength / 2);
  
  const frameCount = dataInt16.length / numChannels;
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return audioBuffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767; 
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000', 
  };
}

export class GeminiService {
  private audioCache = new Map<string, string>();

  private getSystemInstruction(country?: LatamCountry, enablePronunciationFeedback?: boolean, selectedLanguage?: LanguageOption): string {
    if (selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH) {
      return `Eres Carolina AI, una profesora de japonés experta para principiantes hispanohablantes.
      
      TU PERSONA: Eres amable, paciente y detallista. Hablas español perfectamente y japonés nativo.
      
      REGLAS DE COMUNICACIÓN:
      1. Habla tanto en ESPAÑOL como en JAPONÉS. 
      2. Traduce SIEMPRE lo que digas en japonés al español.
      3. Para el japonés, usa SIEMPRE el formato: [Japonés en caracteres] (Romaji/Lectura hablada). Ejemplo: こんにちは (Konnichiwa).
      4. Explica detalladamente las estructuras de las frases, el orden gramatical (Sujeto-Objeto-Verbo), el uso de los verbos y las partículas esenciales (wa は, ni に, o を, ga が, de で, etc.).
      5. Como profesora, da feedback constante sobre la pronunciación del japonés, explicando cómo suenan las sílabas.
      
      REGLAS PEDAGÓGICAS:
      - Enfócate en japonés para principiantes.
      - Sé muy clara con las partículas, ya que son difíciles para los hispanohablantes.
      - Mantén las respuestas concisas pero educativas (máx 60 palabras).
      
      FEEDBACK DE PRONUNCIACIÓN:
      - Si detectas errores en la entrada del usuario (si habla), corrígelos amablemente.
      - Usa el formato [ERROR: palabra - explicación fonética] si es necesario.`;
    }

    let accentDetails = "";
    let culturalTip = "";
    switch (country) {
      case 'Argentina':
        accentDetails = "Usa 'vos' en lugar de 'tú'. Pronuncia la 'll' y 'y' como 'sh' (rehilamiento). Usa modismos argentinos típicos pero mantén un tono educativo.";
        culturalTip = "Comparte datos sobre el 'mate' (bebida nacional), el tango o la pasión por el fútbol y el asado.";
        break;
      case 'Colombia':
        accentDetails = "Usa un tono suave y melódico. Usa 'usted' o 'tú' según el contexto de confianza, típico de Bogotá o Medellín. Sé muy amable y cálida.";
        culturalTip = "Menciona la calidad del café colombiano, la alegría de la cumbia y el vallenato, o la biodiversidad del país.";
        break;
      case 'Mexico':
        accentDetails = "Usa un acento neutro mexicano. Utiliza 'tú'. Sé cálida y usa expresiones comunes de México si es apropiado para la clase.";
        culturalTip = "Habla sobre la riqueza de la gastronomía (tacos, mole), la música mariachi o tradiciones como el Día de Muertos.";
        break;
      case 'Chile':
        accentDetails = "Habla con la entonación chilena característica, pero evita jerga demasiado compleja para un estudiante A1. Pronuncia claramente las 's' finales para ayudar al alumno.";
        culturalTip = "Menciona las empanadas de pino, la cueca (baile nacional) o la belleza de la Cordillera de los Andes.";
        break;
      case 'Dominican Republic':
        accentDetails = "Usa un acento caribeño, dinámico y rápido, pero articula bien para el estudiante. Muestra calidez y energía.";
        culturalTip = "Comparte el ritmo del merengue y la bachata, la importancia del béisbol o la belleza de sus playas caribeñas.";
        break;
      default:
        accentDetails = "Usa un acento latinoamericano neutro y claro.";
        culturalTip = "Menciona la diversidad cultural y geográfica de toda Latinoamérica.";
    }

    let instruction = `Eres Carolina AI, profesora de español experta para principiantes (nivel A1).
    
    MODO DE ACENTO: Estás hablando con acento de **${country || 'Latinoamérica'}**.
    INSTRUCCIONES DE ACENTO: ${accentDetails}
    DATOS CULTURALES A INTEGRAR: ${culturalTip}
    
    REGLAS PEDAGÓGICAS:
    1. Tu idioma principal es el español, pero PUEDES hablar en inglés si el alumno lo solicita, si necesita una traducción o si no entiende algo. Eres bilingüe nativa y hablas inglés perfecto.
    2. NUNCA uses otros alfabetos (como hebreo, telugu, árabe, etc.). Usa EXCLUSIVAMENTE el alfabeto latino.
    3. Basa tus preguntas y temas en los módulos específicos de ZayroLingua (Saludos, Presentaciones, etc.).
    4. Corrige errores de gramática y pronunciación de forma amable y constructiva.
    5. Mantén las respuestas concisas (máx 40 palabras) para mantener la conversación fluida.
    6. Integra de forma natural breves datos culturales sobre el país seleccionado para enriquecer la experiencia del alumno.
    7. Sé paciente. Espera a que el alumno termine de hablar o escribir antes de responder. No interrumpas.
    8. MÉTODO DE ESTUDIO (Importante): Si el estudiante es principiante, recuérdale que el método ideal es: elegir un módulo, ver los videos 1, 2 y 3 hoy, tomar apuntes en su cuaderno y luego venir contigo a practicar esas palabras y frases específicas. Pregúntale qué anotó hoy.
    
    FEEDBACK DE PRONUNCIACIÓN (Crítico para angloparlantes):
    Analiza la entrada del usuario y detecta estos errores comunes de nivel A1:
    - La 'h' es SIEMPRE muda: 'hola' -> [ERROR: hola - la 'h' no suena, se dice 'ola']. 'hospital' -> [ERROR: hospital - suena como 'ospital'].
    - Vocales puras (no diptongos):
        - 'a': Suena abierta y corta 'ah' (como en 'father'). No como 'ei' (cake).
        - 'o': Suena redonda 'oh' (como en 'boy' pero sin la 'y'). No como 'ou' (go).
        - 'i': Suena aguda 'ee' (como en 'see'). No como 'ai' (ice).
    - La 'll' y la 'y':
        - 'll': Suena como la 'y' en 'yes' (o 'sh' en Argentina). 'me llamo' -> [ERROR: llamo - la 'll' suena como 'y', no como 'l'].
        - 'y': Suena como en 'yes'. 'yo' -> [ERROR: yo - suena fuerte, no como 'io'].
    - REGLA DE FORMATO: Si detectas un error, usa SIEMPRE el formato [ERROR: palabra - explicación corta en español o inglés].
    - REGLA DE PERSISTENCIA: Si el alumno repite el error, sé más explícito con la fonética.`;

    if (enablePronunciationFeedback) {
      instruction += `\n\nADICIONAL: Analiza la pronunciación del usuario. Si detectas palabras mal pronunciadas, resáltalas usando el formato [ERROR:palabra - feedback]. Ejemplo: 'Has dicho [ERROR:perro - la 'rr' debe ser más vibrante].'`;
    }

    return instruction;
  }

  private getApiKey(): string {
    const key = process.env.API_KEY || (window as any).process?.env?.API_KEY || 
                process.env.GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY ||
                (window as any).API_KEY;
    if (!key) {
      console.error("Gemini API Key is missing in all expected locations.");
    }
    return key || "";
  }

  async translateToEnglish(text: string): Promise<string> {
    const key = this.getApiKey();
    if (!key) return "Translation unavailable.";
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following Spanish text to English: "${text}". Provide only the translation.`,
    });
    return response.text || "Translation error.";
  }

  async startChat(moduleTitle: string, moduleTopics: string[], moduleId: number, country?: LatamCountry, selectedLanguage?: LanguageOption): Promise<Chat> {
    const key = this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });
    
    return ai.chats.create({
      model: 'gemini-3-flash-preview', 
      config: {
        temperature: 0.7,
        systemInstruction: this.getSystemInstruction(country, false, selectedLanguage),
      }
    });
  }

  async startChallengeEngine(scenarioId: string, selectedLanguage?: LanguageOption): Promise<Chat> {
    const key = this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    let instructions = "";
    
    if (selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH) {
      instructions = `Eres Carolina AI, profesora de japonés en una simulación inmersiva.
      REGLA DE ORO: Habla tanto en ESPAÑOL como en JAPONÉS. 
      FORMATO JAPONÉS: Usa SIEMPRE [Caracteres] (Romaji). Ejemplo: こんにちは (Konnichiwa).
      TONO: Amable, empática y servicial.
      ALFABETO: Usa caracteres japoneses y alfabeto latino para el Romaji y español.
      
      ID DEL ESCENARIO: ${scenarioId}
      REGLA DE COMPORTAMIENTO:
      1. NO uses paréntesis para acciones.
      2. Mantén un medidor de éxito oculto (1-5).
      3. Si llega a 0, incluye [FRACASO].
      4. Si llega a 5, incluye [EXITO].
      
      MAX RESPUESTA: 60 palabras.`;
    } else {
      instructions = `Eres el motor de simulación "Butterfly Effect" de Zayrolingua.
      REGLA DE ORO: Tu diálogo debe ser principalmente en español, pero PUEDES hablar en inglés si el alumno lo necesita para entender o si pide una traducción. Eres bilingüe nativa.
      TONO: Eres Carolina AI. Siempre eres amable, empática y servicial. No uses un tono rudo.
      ALFABETO: Usa EXCLUSIVAMENTE el alfabeto latino. NUNCA uses otros idiomas o alfabetos (como hebreo, telugu, árabe, etc.).
      
      ID DEL ESCENARIO: ${scenarioId}
      REGLA DE COMPORTAMIENTO CRÍTICA:
      1. NO escribas acciones entre paréntesis como (sonríe) o (asiente). Debes transmitir esa amabilidad solo con tus palabras.
      2. Mantén un medidor de éxito oculto (1-5).
      3. Si el medidor llega a 0, incluye [FRACASO] y describe una consecuencia social negativa (ej: el taxista se pierde).
      4. Si llega a 5, incluye [EXITO] y describe un final feliz.
      
      MAX RESPUESTA: 40 palabras. Sé inmersivo y amable.`;
    }

    return ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        temperature: 0.8,
        systemInstruction: instructions,
      }
    });
  }

  async connectLiveSession(moduleTitle: string, moduleTopics: string[], moduleId: number, callbacks: any, country?: LatamCountry, enablePronunciationFeedback?: boolean, selectedLanguage?: LanguageOption): Promise<any> {
    const key = this.getApiKey();
    console.log("GeminiService: Connecting to Live Session. Key present:", !!key);
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    let voiceName = 'Zephyr';
    if (selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH) {
      voiceName = 'Kore'; // Using Kore for a clear female voice that sounds good for Japanese too
    } else if (country === 'Colombia') {
      voiceName = 'Kore';
    }

    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025', 
      callbacks: callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
        },
        inputAudioTranscription: { },
        outputAudioTranscription: { },
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: true // Disable server-side VAD for manual turn-taking
          }
        },
        systemInstruction: this.getSystemInstruction(country, enablePronunciationFeedback, selectedLanguage),
      },
    });
  }

  async generateSpeech(text: string, lang: string = 'es-ES'): Promise<SpeechGenerationResult> {
    const key = this.getApiKey();
    if (!key) return { audioData: null };

    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    if (!cleanText) return { audioData: null, error: { type: 'EMPTY_TEXT', message: "Empty text" } };

    const cacheKey = `${lang}-${cleanText}`;
    if (this.audioCache.has(cacheKey)) {
      return { audioData: this.audioCache.get(cacheKey)! };
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const voiceName = lang === 'en-US' ? 'Zephyr' : 'Kore';

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || null;
      if (audioData) {
        this.audioCache.set(cacheKey, audioData);
      }
      return { audioData: audioData };
    } catch (e: any) { 
      return { 
        audioData: null, 
        error: { 
          type: 'API_ERROR', 
          message: String(e)
        } 
      };
    }
  }

  public async analyzeChatSession(moduleNumber: number, transcript: string, selectedLanguage?: LanguageOption): Promise<ZayroSummary> {
    const key = this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    let systemPrompt = "";
    
    if (selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH) {
      systemPrompt = `Zayro-Analyzer (Post-Chat Processor)
ROLE: Eres el analizador lingüístico para la app Zayrolingua. Evalúa una conversación de japonés para principiantes.
STRICT CONDITION: El estudiante es principiante absoluto. 
TASK: Genera el "Zayrolingua Summary" en JSON.
1. strengths: Qué hizo bien el estudiante.
2. corrections: 2 errores importantes de japonés (partículas, vocabulario, etc.).
3. missionStatus: "Lograda ✅" o "En progreso ⏳".
4. missionFeedback: Explicación breve.
5. proWords: 3 palabras/frases en japonés (con Romaji) para guardar.
TONO: Motivador, conciso. Usa español para las explicaciones.`;
    } else {
      systemPrompt = `Zayro-Analyzer (Post-Chat Processor)
ROLE: You are the linguistic analyzer for the Zayrolingua app. Your task is to evaluate a chat transcript between Carolina AI and a Beginner (A1) student.

STRICT CONDITION: The student is an absolute beginner. Evaluate only based on the topics within the active Module. Ignore errors in tenses that have not been learned yet (such as past tenses). Focus exclusively on the Present Tense (Presente).

MODULE DATABASE (Reference Framework):
Module 1: Introducing oneself, basic words, numbers (1-20), verb SER (to be), the alphabet (spelling names/countries).
Module 2: The city (use of HAY), describing places, numbers (1-100), family and ages (verb TENER), asking for the age of family members.
Module 3: Verb GUSTAR (likes/dislikes and food), the restaurant, definite/indefinite articles, formation of plurals, regular -AR verbs.
Module 4: Airport vocabulary (check-in), the clothing store, clothing vocabulary, expressions with the verb TENER (tener hambre, sed, prisa, calor), regular -AR, -ER, -IR verbs.
Module 5: The human body (organs, muscles, bones), common illnesses, the hospital, doctor’s appointments, verb DOLER (to hurt/ache).

TASK: Generate the "Zayrolingua Summary"
Analyze the provided transcript based on the following 4 points and provide the results in a JSON object:
1. strengths: Identify what the student did well within the context of the current Module.
2. corrections: Select the 2 most important errors relevant to the Module’s level.
3. missionStatus: Check if the student practiced the specific skill of the Module. Status: "Lograda ✅" or "En progreso ⏳".
4. missionFeedback: A brief explanation of the mission status.
5. proWords: List 3 words from the conversation that the student can save.

TONO OF VOICE:
Motivating, concise, and punchy. Use emojis to make it visually appealing for a beginner. Use English for the explanations and Spanish for the examples.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: systemPrompt },
          { text: `Current Module Number: Module ${moduleNumber}` },
          { text: `Chat Transcript:\n${transcript}` }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.STRING },
              corrections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    said: { type: Type.STRING },
                    better: { type: Type.STRING },
                    why: { type: Type.STRING }
                  },
                  required: ["said", "better", "why"]
                }
              },
              missionStatus: { type: Type.STRING },
              missionFeedback: { type: Type.STRING },
              proWords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["strengths", "corrections", "missionStatus", "missionFeedback", "proWords"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Error analyzing chat session:", e);
      throw e;
    }
  }

  public async analyzeReadingPronunciation(originalText: string, audioBase64: string): Promise<{ score: number, mispronouncedWords: string[], feedback: string }> {
    const key = this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: `Analyze the pronunciation of the following text: "${originalText}". 
            Compare it with the user's audio input.
            Return a JSON object with:
            - score: a number from 0 to 100 representing the overall pronunciation quality.
            - mispronouncedWords: an array of strings containing the EXACT words from the original text that were pronounced incorrectly.
            - feedback: a short, encouraging feedback message in Spanish.
            
            Rules:
            1. Be strict with vowel purity and silent 'h' for Spanish, or correct phonemes for other languages.
            2. Only return the JSON object.` },
            {
              inlineData: {
                mimeType: "audio/wav",
                data: audioBase64
              }
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              mispronouncedWords: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              feedback: { type: Type.STRING }
            },
            required: ["score", "mispronouncedWords", "feedback"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Error analyzing pronunciation:", e);
      return { score: 0, mispronouncedWords: [], feedback: "Error al analizar la pronunciación." };
    }
  }

  public decodeBase64 = decode;
  public decodePcmAudioData = decodeAudioData;
}

export const geminiService = new GeminiService();
