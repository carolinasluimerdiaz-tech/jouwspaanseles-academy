
import { GoogleGenAI, Modality, LiveServerMessage, Chat } from "@google/genai";
import { SpeechGenerationResult, LatamCountry } from "../types"; 

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



  private getSystemInstruction(country?: LatamCountry, enablePronunciationFeedback?: boolean): string {
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

  private async getApiKey(): Promise<string> {
    let key = process.env.API_KEY || (window as any).process?.env?.API_KEY || 
                process.env.GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY ||
                (window as any).API_KEY;
    
    if (!key) {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          key = data.apiKey;
        }
      } catch (e) {
        console.error("Failed to fetch API key from server", e);
      }
    }

    if (!key) {
      console.error("Gemini API Key is missing in all expected locations.");
    }
    return key || "";
  }

  async translateToEnglish(text: string): Promise<string> {
    const key = await this.getApiKey();
    if (!key) return "Translation unavailable.";
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following Spanish text to English: "${text}". Provide only the translation.`,
    });
    return response.text || "Translation error.";
  }

  async startChat(moduleTitle: string, moduleTopics: string[], moduleId: number, country?: LatamCountry): Promise<Chat> {
    const key = await this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });
    
    return ai.chats.create({
      model: 'gemini-3-flash-preview', 
      config: {
        temperature: 0.7,
        systemInstruction: this.getSystemInstruction(country),
      }
    });
  }

  async startChallengeEngine(scenarioId: string): Promise<Chat> {
    const key = await this.getApiKey();
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    const instructions = `Eres el motor de simulación "Butterfly Effect" de Zayrolingua.
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

    return ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        temperature: 0.8,
        systemInstruction: instructions,
      }
    });
  }

  async connectLiveSession(moduleTitle: string, moduleTopics: string[], moduleId: number, callbacks: any, country?: LatamCountry, enablePronunciationFeedback?: boolean): Promise<any> {
    const key = await this.getApiKey();
    console.log("GeminiService: Connecting to Live Session. Key present:", !!key);
    if (!key) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: key });

    const voiceName = country === 'Colombia' ? 'Kore' : 'Zephyr';

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
        systemInstruction: this.getSystemInstruction(country, enablePronunciationFeedback),
      },
    });
  }

  async generateSpeech(text: string, lang: string = 'es-ES'): Promise<SpeechGenerationResult> {
    const key = await this.getApiKey();
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

  public decodeBase64 = decode;
  public decodePcmAudioData = decodeAudioData;
}

export const geminiService = new GeminiService();
