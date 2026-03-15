import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Stethoscope, 
  ShieldAlert, 
  ShoppingBag, 
  Sparkles, 
  Loader2, 
  Info, 
  SplitSquareVertical, 
  Ear, 
  Wifi,
  Languages,
  AlertTriangle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { geminiService } from '../services/geminiService'; // Import the shared Gemini service
import { SpeechGenerationResult } from '../types'; // Import SpeechGenerationResult

// Fix: Add global TypeScript declarations for Web Speech API types.
// This resolves 'Cannot find name' errors for SpeechRecognition and its related event types,
// ensuring type safety when using these standard browser APIs.
declare global {
  interface SpeechRecognitionResult extends EventTarget {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly interpretation?: any; // Marked optional and 'any' as it varies
    readonly emma?: Document; // Marked optional
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
  }

  type SpeechRecognitionErrorCode =
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';

  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }

  interface SpeechGrammarList {
    readonly length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(uri: string, weight?: number): void;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
  }

  // Fix: Add missing SpeechRecognitionEventInit and SpeechRecognitionErrorEventInit interfaces
  interface SpeechRecognitionEventInit extends EventInit {
    resultIndex?: number;
    results?: SpeechRecognitionResultList;
    interpretation?: any;
    emma?: Document;
  }

  interface SpeechRecognitionErrorEventInit extends EventInit {
    error: SpeechRecognitionErrorCode;
    message?: string;
  }

  interface Window {
    // Fix: Correctly define the constructor types for SpeechRecognition and its events.
    SpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    SpeechRecognitionEvent: {
      new (type: string, eventInitDict?: SpeechRecognitionEventInit): SpeechRecognitionEvent;
      prototype: SpeechRecognitionEvent;
    };
    webkitSpeechRecognitionEvent: {
      new (type: string, eventInitDict?: SpeechRecognitionEventInit): SpeechRecognitionEvent;
      prototype: SpeechRecognitionEvent;
    };
    SpeechRecognitionErrorEvent: {
      new (type: string, eventInitDict?: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent;
      prototype: SpeechRecognitionErrorEvent;
    };
    webkitSpeechRecognitionErrorEvent: {
      new (type: string, eventInitDict?: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent;
      prototype: SpeechRecognitionErrorEvent;
    };
  }
}

type ContextType = 'Medical' | 'Legal' | 'Shopping';

export const PremiumSection: React.FC = () => {
  const [context, setContext] = useState<ContextType>('Medical');
  const [isListening, setIsListening] = useState(false);
  const [recognitionActiveLang, setRecognitionActiveLang] = useState<'es-ES' | 'en-US' | null>(null);
  const [userText, setUserText] = useState('');
  const [interlocutorText, setInterlocutorText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(true);
  const [recognitionErrorDisplayMessage, setRecognitionErrorDisplayMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentListeningTextRef = useRef<string>(''); // To accumulate text during continuous recognition

  // AudioContext refs for Gemini TTS playback
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null); // To stop currently playing audio
  const isAudioPlaybackSupported = useRef(false); // Tracks if AudioContext is available

  // Function to stop current TTS playback
  const handleStopSpeaking = useCallback(() => {
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.stop();
      currentAudioSourceRef.current.disconnect();
      currentAudioSourceRef.current = null;
    }
    // Also cancel browser synthesis just in case (though we primarily use Gemini TTS now)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Function to play audio using Gemini TTS
  const speakText = useCallback(async (text: string, lang: string) => {
    handleStopSpeaking(); // Stop any ongoing speech before starting new one

    if (!isAudioPlaybackSupported.current || !outputAudioContextRef.current || !outputGainNodeRef.current) {
      console.warn("Audio playback not supported or initialized in PremiumSection.");
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      // Use the shared geminiService
      // Fix: Now `generateSpeech` returns `SpeechGenerationResult`
      const speechResult: SpeechGenerationResult = await geminiService.generateSpeech(text, lang);

      // Fix: Access audioData and error properties from speechResult
      if (speechResult.audioData) {
        const audioBuffer = await geminiService.decodePcmAudioData(
          geminiService.decodeBase64(speechResult.audioData),
          outputAudioContextRef.current,
          24000,
          1,
        );

        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputGainNodeRef.current);
        source.onended = () => {
          setIsSpeaking(false);
          currentAudioSourceRef.current = null;
        };
        source.start(0);
        currentAudioSourceRef.current = source;
      } else if (speechResult.error?.type !== 'EMPTY_TEXT') { // Fix: Check speechResult.error.type
        console.error("Gemini TTS error in PremiumSection:", speechResult.error?.message); // Fix: Check speechResult.error.message
        // Optionally display a user-friendly error message for TTS
        setRecognitionErrorDisplayMessage(speechResult.error?.message || "Problemas para generar la voz."); // Fix: Check speechResult.error.message
        setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);
        setIsSpeaking(false);
      } else {
        setIsSpeaking(false); // Text was empty, no audio to play
      }
    } catch (audioError) {
      console.error("Error decoding or playing audio in PremiumSection:", audioError);
      setRecognitionErrorDisplayMessage("Error al reproducir el audio.");
      setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);
      setIsSpeaking(false);
    }
  }, [handleStopSpeaking]); // Added handleStopSpeaking to deps for safety

  // Main effect for SpeechRecognition setup and audio context initialization
  useEffect(() => {
    // 1. Initialize AudioContext
    if (window.AudioContext || (window as any).webkitAudioContext) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputGainNodeRef.current = outputAudioContextRef.current.createGain();
      outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);
      isAudioPlaybackSupported.current = true;
    } else {
      console.warn("Web Audio API (AudioContext) not supported in this browser for PremiumSection.");
      isAudioPlaybackSupported.current = false;
    }

    // 2. Setup SpeechRecognition
    const setupSpeechRecognition = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediate stream after permission check
        setHasMicrophonePermission(true);

        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = true; // Listen continuously until stopped
          recognition.interimResults = true; // Provide live feedback

          recognition.onstart = () => {
            console.log("Speech recognition started.");
            setIsListening(true);
            setRecognitionErrorDisplayMessage(null); // Clear any previous errors
            currentListeningTextRef.current = ''; // Reset accumulated text
          };

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            // Update ref for real-time display.
            // The UI will read from this ref when `isListening` is true.
            currentListeningTextRef.current = finalTranscript || interimTranscript;
            // Force re-render to update the displayed text immediately
            if (recognitionActiveLang === 'es-ES') {
              setUserText(currentListeningTextRef.current);
            } else if (recognitionActiveLang === 'en-US') {
              setInterlocutorText(currentListeningTextRef.current);
            }
            //console.log("onresult - interim:", interimTranscript, "final:", finalTranscript);
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setRecognitionActiveLang(null);
            setRecognitionErrorDisplayMessage(`Error del micrófono: ${event.error}. Por favor, intenta de nuevo.`);
            setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);
            currentListeningTextRef.current = ''; // Clear on error
          };

          recognition.onend = async () => {
            console.log("Speech recognition ended.");
            setIsListening(false);
            const capturedText = currentListeningTextRef.current;
            const recognizedLang = recognition.lang; // Use the language set on the recognition instance

            if (capturedText) {
              // Now that recognition has ended, update the final displayed text
              if (recognizedLang === 'es-ES') setUserText(capturedText);
              if (recognizedLang === 'en-US') setInterlocutorText(capturedText);
              await handleTranslation(capturedText, recognizedLang);
            } else {
              // If recognition ended without capturing text, reset UI
              setUserText('');
              setInterlocutorText('');
            }
            currentListeningTextRef.current = ''; // Clear for next session
            setRecognitionActiveLang(null); // Reset active language
          };
          
          recognitionRef.current = recognition;
        } else {
          console.warn("Web Speech API (SpeechRecognition) not supported in this browser for PremiumSection.");
          setHasMicrophonePermission(false);
          setRecognitionErrorDisplayMessage("Tu navegador no soporta el reconocimiento de voz. Por favor, usa Chrome o Edge.");
        }
      } catch (err) {
        console.error('Microphone access denied or error:', err);
        setHasMicrophonePermission(false);
        setRecognitionErrorDisplayMessage("Acceso al micrófono denegado. Por favor, habilítalo en la configuración de tu navegador para usar el intérprete.");
      }
    };

    setupSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Ensure it's stopped
        // Clear event handlers on unmount to prevent memory leaks and stale closures
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
      if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
      }
    };
  }, [handleStopSpeaking, speakText, recognitionActiveLang]);


  const handleTranslation = async (text: string, sourceLang: string) => {
    if (!text.trim()) {
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);
    handleStopSpeaking(); // Ensure any previous speech is stopped

    const targetLang = sourceLang === 'es-ES' ? 'en-US' : 'es-ES';

    const systemInstruction = `You are a professional high-stakes interpreter for a ${context} context. 
    Your mission is to provide 100% accurate, literal, and professional translations.
    - If the context is Medical: Use precise anatomical and pharmacological terms.
    - If the context is Legal: Use formal and correct legal terminology.
    - Never use slang or informal language unless the source text explicitly uses it.
    - Maintain the tone of the speaker but prioritize technical accuracy.
    - Target Language: ${targetLang === 'es-ES' ? 'Spanish' : 'English'}.
    - Source Language: ${sourceLang === 'es-ES' ? 'Spanish' : 'English'}.
    - Provide only the translated text, without additional commentary.
    - REGLA DE ORO: Usa EXCLUSIVAMENTE el alfabeto latino. NUNCA uses otros alfabetos (como hebreo, telugu, árabe, etc.).`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' }); // Always instantiate fresh for API key
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Changed to PRO model for higher precision
        contents: `Translate the following text strictly following your instructions: "${text}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // Low temperature for more literal and accurate translations
        }
      });
      
      const translatedText = response.text || '';
      
      if (sourceLang === 'es-ES') {
        setInterlocutorText(translatedText); // Set translated text to interlocutor side
        await speakText(translatedText, targetLang);
      } else { // sourceLang === 'en-US'
        setUserText(translatedText); // Set translated text to user side
        await speakText(translatedText, targetLang);
      }
    } catch (e: any) {
      console.error("Translation error", e);
      setRecognitionErrorDisplayMessage(`Error de traducción: ${e.message || "Ocurrió un problema."}`);
      setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);

      // Reset text states if an error occurs to avoid stale display
      if (sourceLang === 'es-ES') {
        setInterlocutorText("Error en la traducción.");
        // Keep original user input for context (it was already set by onresult)
      } else {
        setUserText("Error en la traducción.");
        // Keep original interlocutor input for context (it was already set by onresult)
      }
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = (side: 'USER' | 'INTERLOCUTOR') => {
    // Disable if AI is processing, no mic, recognition not initialized, or AI is speaking
    if (isProcessing || !hasMicrophonePermission || !recognitionRef.current || isSpeaking) {
      console.log("Cannot start listening. Conditions:", {isProcessing, hasMicrophonePermission, recognitionRef: !!recognitionRef.current, isSpeaking});
      return;
    }
    
    // Stop any existing recognition session first, regardless of side
    if (isListening && recognitionRef.current) {
      console.log("Existing recognition active, attempting to abort it.");
      recognitionRef.current.abort(); // Force stop any ongoing recognition
      // The onend handler will then fire, resetting states.
      // We explicitly *do not* call start() immediately here.
      // The user will need to click again after the abort/onend cycle completes.
      setIsListening(false);
      setRecognitionActiveLang(null);
      currentListeningTextRef.current = '';
      return;
    }
    
    // Clear previous texts immediately for a clean slate
    setUserText('');
    setInterlocutorText('');
    currentListeningTextRef.current = ''; // Clear the ref as well

    const lang = side === 'USER' ? 'es-ES' : 'en-US';
    
    recognitionRef.current.lang = lang;
    setRecognitionActiveLang(lang); // Set this immediately to indicate which side is active
    
    try {
      recognitionRef.current.start();
      console.log(`Attempting to start recognition for ${lang}.`);
    } catch (e: any) {
      console.error("Error starting speech recognition:", e);
      if (e.message.includes("recognition has already started")) {
        // This case should ideally be caught by the `if (isListening)` block above,
        // but if it still happens due to a race condition, we abort and wait.
        console.warn("Recognition already started, attempting to abort again.");
        recognitionRef.current.abort();
        setRecognitionErrorDisplayMessage("El micrófono ya estaba activo. Intenta de nuevo.");
        setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);
      } else {
        setRecognitionErrorDisplayMessage("No se pudo iniciar la escucha: " + e.message);
        setTimeout(() => setRecognitionErrorDisplayMessage(null), 5000);
      }
      setIsListening(false); // Ensure state is reset
      setRecognitionActiveLang(null);
      currentListeningTextRef.current = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-500">
      
      {/* Context Selection Header */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {(['Medical', 'Legal', 'Shopping'] as ContextType[]).map((c) => (
          <button 
            key={c}
            onClick={() => setContext(c)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-brand font-black uppercase text-xs tracking-widest transition-all shadow-md ${context === c ? 'bg-spanish-red text-white scale-105' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
          >
            {c === 'Medical' && <Stethoscope size={18} />}
            {c === 'Legal' && <ShieldAlert size={18} />}
            {c === 'Shopping' && <ShoppingBag size={18} />}
            {c}
          </button>
        ))}
      </div>

      {!hasMicrophonePermission && (
         <div className="bg-red-50 p-6 rounded-[2rem] border-2 border-red-200 text-red-700 flex items-start gap-4 animate-in fade-in mb-8">
          <AlertTriangle size={24} />
          <div>
            <h4 className="font-brand font-black text-lg uppercase">Microphone Access Denied!</h4>
            <p className="text-sm">
              The Interpreter requires microphone access. Please enable it in your browser settings.
            </p>
          </div>
        </div>
      )}

      {recognitionErrorDisplayMessage && (
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-700 flex items-center gap-2 text-sm mb-4 animate-in fade-in">
          <AlertTriangle size={18} /> {recognitionErrorDisplayMessage}
        </div>
      )}

      {/* Main Split Interface */}
      <div className="flex-1 flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-100">
        
        {/* Top Section: Interlocutor (English) */}
        <div className={`flex-1 relative transition-colors duration-500 flex flex-col items-center justify-center p-10 ${recognitionActiveLang === 'en-US' ? 'bg-spanish-red/10' : 'bg-spanish-red'}`}>
          <div className="absolute top-6 left-6 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-white/40"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Interlocutor (English)</span>
          </div>
          
          <div className="max-w-2xl text-center">
            <p className="text-white font-brand font-black text-3xl md:text-4xl leading-tight drop-shadow-lg transition-all">
              {recognitionActiveLang === 'en-US' && isListening ? (currentListeningTextRef.current || 'Listening...') : interlocutorText || 'Waiting for English speech...'}
            </p>
          </div>

          <button 
            onClick={() => startListening('INTERLOCUTOR')}
            disabled={!hasMicrophonePermission || isProcessing || isSpeaking}
            className={`mt-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl 
              ${recognitionActiveLang === 'en-US' && isListening ? 'bg-white text-spanish-red scale-125 animate-pulse' : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'}
              ${!hasMicrophonePermission || isProcessing || isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {recognitionActiveLang === 'en-US' && isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2"></div>
        </div>

        {/* Bottom Section: User (Spanish) */}
        <div className={`flex-1 relative transition-colors duration-500 flex flex-col items-center justify-center p-10 ${recognitionActiveLang === 'es-ES' ? 'bg-spanish-gold/20' : 'bg-spanish-gold'}`}>
          <div className="absolute top-6 left-6 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-spanish-red/40"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-spanish-red/60">User (Spanish)</span>
          </div>

          <div className="max-w-2xl text-center">
            <p className="text-spanish-red font-brand font-black text-3xl md:text-4xl leading-tight transition-all">
              {recognitionActiveLang === 'es-ES' && isListening ? (currentListeningTextRef.current || 'Listening...') : userText || 'Press to speak in Spanish...'}
            </p>
          </div>

          <button 
            onClick={() => startListening('USER')}
            disabled={!hasMicrophonePermission || isProcessing || isSpeaking}
            className={`mt-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl 
              ${recognitionActiveLang === 'es-ES' && isListening ? 'bg-red-500 text-white scale-125 animate-pulse' : 'bg-spanish-red text-white hover:scale-110 active:scale-95'}
              ${!hasMicrophonePermission || isProcessing || isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {recognitionActiveLang === 'es-ES' && isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          {isProcessing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-lg flex flex-col items-center justify-center z-20 animate-in fade-in">
              <div className="relative">
                <Loader2 className="animate-spin text-spanish-red mb-4" size={56} />
                <Sparkles className="absolute -top-2 -right-2 text-spanish-gold animate-bounce" size={24} />
              </div>
              <p className="font-brand font-black uppercase tracking-[0.2em] text-spanish-red text-xs">Premium Translation Engine...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6 bg-white p-5 rounded-3xl shadow-xl border border-spanish-gold/20 flex-1 w-full md:w-auto">
           <div className="w-12 h-12 bg-spanish-gold rounded-2xl flex items-center justify-center text-spanish-red shadow-inner">
             <Languages size={24} />
           </div>
           <div>
             <h5 className="font-brand font-black text-xs uppercase text-gray-800">Gemini 3 Pro Engine</h5>
             <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
               <Wifi size={10} /> Active High Precision
             </p>
           </div>
           <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ready</span>
           </div>
        </div>

        <div className="bg-red-50 p-6 rounded-3xl border-2 border-spanish-red/10 flex items-start gap-4 flex-1">
           <AlertTriangle size={20} className="text-spanish-red shrink-0" />
           <div className="space-y-1">
             <p className="text-[10px] font-black text-spanish-red uppercase tracking-widest leading-none mb-1">Disclaimer / Legal Notice</p>
             <p className="text-[9px] text-gray-500 font-bold italic leading-tight">
               EN: This tool is an AI assistant, not an official sworn interpreter. <br/>
               ES: Esta herramienta es un asistente IA, no un intérprete jurado oficial.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};