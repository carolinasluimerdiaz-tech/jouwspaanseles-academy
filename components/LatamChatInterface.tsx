
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, AppSection, LatamCountry, SpeechGenerationResult, ZayroSummary } from '../types'; 
import { geminiService, createPcmBlob } from '../services/geminiService'; // Import createPcmBlob
import { MODULES } from '../constants';
import { ZayroBotIcon } from './ZayroBotIcon';
import { 
  Send, ArrowLeft, Loader2, Volume2, Mic, MicOff, 
  AlertCircle, Sparkles, Lock, 
  UserCircle, Info, Camera, Signal, Languages, RefreshCw, CheckCircle, Trophy
} from 'lucide-react'; 
import { LiveServerMessage, Modality } from '@google/genai'; // Import LiveServerMessage and Modality

interface LatamChatInterfaceProps {
  isFreeUser?: boolean;
  onNavigate: (section: AppSection) => void;
}

export const LatamChatInterface: React.FC<LatamChatInterfaceProps> = ({
  isFreeUser = false,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStreamActive, setAudioStreamActive] = useState(false); // Indicates if mic input is streaming to Live API
  const [apiKeyState, setApiKeyState] = useState<'LOADING' | 'PRESENT' | 'MISSING' | 'REJECTED'>('LOADING');
  const [enablePronunciationFeedback, setEnablePronunciationFeedback] = useState(true);
  
  const liveSessionRef = useRef<any | null>(null); // Reference to the Gemini Live session
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const inputScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null); 
  const isAudioPlaybackSupported = useRef(false); 
  let nextOutputAudioStartTime = useRef<number>(0); // For smooth audio playback queuing

  const messagesEndRef = useRef<HTMLDivElement>(null); 
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1); 
  const currentModule = MODULES.find(m => m.id === selectedModuleId);

  const [userProfileImage, setUserProfileImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zayrolingua_user_profile_image') || null;
    }
    return null;
  });

  const [selectedCountry, setSelectedCountry] = useState<LatamCountry>('Mexico');
  const latamCountries: { name: LatamCountry; flag: string }[] = [
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'Dominican Republic', flag: '🇩🇴' }
  ];

  // Track current transcription states for real-time display
  const currentInputTranscription = useRef<string>('');
  const currentOutputTranscription = useRef<string>('');


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleStopSpeaking = useCallback(() => {
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.stop();
      currentAudioSourceRef.current.disconnect();
      currentAudioSourceRef.current = null;
    }
    setIsSpeaking(false);
    nextOutputAudioStartTime.current = 0; // Reset start time for new playback
  }, []);

  const speakTextManually = async (text: string) => {
    handleStopSpeaking();
    if (!outputAudioContextRef.current || !outputGainNodeRef.current) return;
    
    setIsSpeaking(true);
    try {
        if (outputAudioContextRef.current.state === 'suspended') {
            await outputAudioContextRef.current.resume();
        }
        // Strip markdown for speech
        const cleanText = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '');
        
        const speech = await geminiService.generateSpeech(cleanText, 'es-US'); // Use generic Latin American Spanish for TTS
        if (speech.audioData) {
            const buffer = await geminiService.decodePcmAudioData(
                geminiService.decodeBase64(speech.audioData),
                outputAudioContextRef.current,
                24000,
                1
            );
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputGainNodeRef.current);
            source.onended = () => setIsSpeaking(false);
            source.start(0);
            currentAudioSourceRef.current = source;
        } else {
            // Fallback to browser TTS
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voiceLang = selectedCountry === 'Mexico' ? 'es-MX' : 
                              selectedCountry === 'Argentina' ? 'es-AR' : 
                              selectedCountry === 'Colombia' ? 'es-CO' : 'es-ES';
            utterance.lang = voiceLang;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    } catch (e) {
        console.error("TTS Error:", e);
        setIsSpeaking(false);
    }
  };




  // Effect for setting up audio contexts and microphone streaming
  useEffect(() => {
    // 1. Initialize AudioContexts
    if (window.AudioContext || (window as any).webkitAudioContext) {
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputGainNodeRef.current = outputAudioContextRef.current.createGain();
      outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);
      isAudioPlaybackSupported.current = true;
    } else {
      console.warn("Web Audio API (AudioContext) not supported in this browser for LATAM.");
      isAudioPlaybackSupported.current = false;
    }

    // Cleanup function
    return () => {
      handleStopSpeaking();
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
      }
      if (inputScriptProcessorRef.current) {
        inputScriptProcessorRef.current.disconnect();
        inputScriptProcessorRef.current.onaudioprocess = null;
      }
      if (inputSourceNodeRef.current) {
        inputSourceNodeRef.current.disconnect();
      }
      if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
      }
      if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
      }
    };
  }, [handleStopSpeaking]);


  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Check API Key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      let present = !!(process.env.API_KEY || process.env.GEMINI_API_KEY);
      if (typeof (window as any).aistudio !== 'undefined' && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
        present = await (window as any).aistudio.hasSelectedApiKey();
      }
      setApiKeyState(present ? 'PRESENT' : 'MISSING');
    };
    checkApiKey();
  }, []); 

  const [connectionState, setConnectionState] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('DISCONNECTED');
  const [retryCount, setRetryCount] = useState(0);
  const [summary, setSummary] = useState<ZayroSummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep Alive Ping to prevent session timeout
  useEffect(() => {
    if (connectionState === 'CONNECTED' && liveSessionRef.current) {
      keepAliveIntervalRef.current = setInterval(() => {
        if (liveSessionRef.current) {
          // Send a small silent audio chunk or just a text message to keep alive
          // Some APIs close on inactivity.
          console.log("Sending keep-alive ping...");
          try {
            liveSessionRef.current.sendRealtimeInput({ text: " " });
          } catch (e) {
            console.warn("Keep-alive ping failed:", e);
          }
        }
      }, 30000); // Every 30 seconds
    } else {
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
    }
    return () => {
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
    };
  }, [connectionState]);

  // ... (existing refs)

  // Initialize Live Chat Session when module, country or API key changes
  useEffect(() => {
    const initializeLiveChatSession = async () => {
      if (!currentModule || currentModule.id === 0) {
        setSelectedModuleId(1);
        return;
      }

      // Don't reset everything if we are just retrying with same params, unless it's a hard reset
      if (connectionState === 'CONNECTING' && retryCount === 0) {
         // Initial connecting state
      }

      handleStopSpeaking();
      // Only clear messages if we are changing modules or countries, not just retrying
      // But for simplicity, let's keep it clean
      if (retryCount === 0) {
          setMessages([]);
      }
      setIsSending(false);
      
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
      }
      if (audioStreamActive) {
        setAudioStreamActive(false); // Stop mic if active
      }

      if (apiKeyState !== 'PRESENT') {
        console.warn("API Key not present for LATAM, deferring Live chat initialization.");
        setConnectionState('DISCONNECTED');
        return;
      }

      // Check if the actual key is available in the environment
      const envKey = process.env.API_KEY || (window as any).process?.env?.API_KEY || 
                     process.env.GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY;
      if (!envKey) {
         console.warn("API Key state is PRESENT but actual key is missing in env. Retrying in 1s...");
         if (retryCount < 5) {
             setTimeout(() => setRetryCount(prev => prev + 1), 1000);
             setConnectionState('CONNECTING');
             return;
         } else {
             setMessages(prev => [...prev, { role: 'model', text: "Error crítico: La clave API no se cargó correctamente. Por favor recarga la página." }]);
             setConnectionState('ERROR');
             return;
         }
      }

      setConnectionState('CONNECTING');

      const callbacks = {
        onopen: async () => {
          console.log('Gemini Live session opened (LATAM).');
          const welcomeText = `¡Hola desde **${selectedCountry}**! Soy Zayrolingua LATAM. Hoy practicaremos **${currentModule?.title}**. ¿Listo?`;
          setMessages(prev => [...prev, { role: 'model', text: welcomeText }]);
          scrollToBottom();
          speakTextManually(welcomeText);
        },
        onmessage: async (message: LiveServerMessage) => {
          console.log('Gemini Live message (LATAM):', message);
    
          if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            // Handle incoming audio chunks from the model
            const base64EncodedAudioString = message.serverContent.modelTurn.parts[0].inlineData.data;
            if (base64EncodedAudioString && outputAudioContextRef.current && outputGainNodeRef.current) {
              setIsSpeaking(true);
              try {
                // CRITICAL: Ensure audio context is resumed to allow playback
                if (outputAudioContextRef.current.state === 'suspended') {
                  await outputAudioContextRef.current.resume();
                }
    
                nextOutputAudioStartTime.current = Math.max(nextOutputAudioStartTime.current, outputAudioContextRef.current.currentTime);
                const audioBuffer = await geminiService.decodePcmAudioData(
                  geminiService.decodeBase64(base64EncodedAudioString),
                  outputAudioContextRef.current,
                  24000,
                  1,
                );
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputGainNodeRef.current);
                source.onended = () => { /* Audio chunk ended, not necessarily full speech end */ };
                source.start(nextOutputAudioStartTime.current);
                nextOutputAudioStartTime.current += audioBuffer.duration;
                currentAudioSourceRef.current = source; // Keep track of the last source for stopping
              } catch (audioError) {
                console.error("Error decoding or playing streaming audio (LATAM):", audioError);
                setIsSpeaking(false);
              }
            }
          }
    
          // Handle transcriptions
          if (message.serverContent?.outputTranscription) {
            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            // Update the last bot message with streaming text
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'model') {
                return [...prev.slice(0, -1), { ...lastMessage, text: currentOutputTranscription.current }];
              }
              return [...prev, { role: 'model', text: currentOutputTranscription.current }];
            });
            scrollToBottom();
          }
    
          if (message.serverContent?.inputTranscription) {
            currentInputTranscription.current += message.serverContent.inputTranscription.text;
            // Update the last user message with streaming text
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'user') {
                return [...prev.slice(0, -1), { ...lastMessage, text: currentInputTranscription.current }];
              }
              return [...prev, { role: 'user', text: currentInputTranscription.current }];
            });
            scrollToBottom();
          }
    
          if (message.serverContent?.turnComplete) {
            console.log("Turn complete (LATAM).");
            // Add final transcription to messages and clear current refs
            if (currentInputTranscription.current) {
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'user') {
                  return [...prev.slice(0, -1), { ...lastMessage, text: currentInputTranscription.current }];
                }
                return [...prev, { role: 'user', text: currentInputTranscription.current }];
              });
            }
            if (currentOutputTranscription.current) {
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'model') {
                  return [...prev.slice(0, -1), { ...lastMessage, text: currentOutputTranscription.current }];
                }
                return [...prev, { role: 'model', text: currentOutputTranscription.current }];
              });
            }
            currentInputTranscription.current = '';
            currentOutputTranscription.current = '';
            setIsSpeaking(false); // Model finished speaking
            nextOutputAudioStartTime.current = 0; // Reset for next turn
          }
    
          if (message.serverContent?.interrupted) {
            console.log("Model response interrupted (LATAM).");
            handleStopSpeaking(); // Stop current playback
          }
    
          setIsSending(false); // Response is arriving/complete
          scrollToBottom();
        },
        onerror: (e: ErrorEvent) => {
          console.error('Gemini Live session error (LATAM):', e);
          setMessages(prev => [...prev, { role: 'model', text: "Error de conexión en el chat en vivo LATAM. Intenta recargar.", errorText: e.message }]);
          setIsSending(false);
          setAudioStreamActive(false);
          handleStopSpeaking();
          liveSessionRef.current?.close();
          liveSessionRef.current = null;
        },
        onclose: (e: CloseEvent) => {
          console.log('Gemini Live session closed (LATAM):', e);
          setIsSending(false);
          setAudioStreamActive(false);
          handleStopSpeaking();
          liveSessionRef.current = null;
          setConnectionState('DISCONNECTED');
          
          // Auto-reconnect once if it was unexpected
          if (e.code !== 1000 && retryCount < 3) {
            console.log("Unexpected close, attempting auto-reconnect...");
            setRetryCount(prev => prev + 1);
          }
        },
      };

      try {
        liveSessionRef.current = await geminiService.connectLiveSession(
          currentModule.title, 
          currentModule.topics, 
          currentModule.id, 
          callbacks,
          selectedCountry,
          enablePronunciationFeedback
        );
        console.log("Gemini Live session initialized (LATAM).");
        setConnectionState('CONNECTED');
        // The actual welcome message is handled by onopen callback
      } catch (error: any) {
        console.error("Error initializing Live chat session (LATAM):", error);
        
        if (error.message?.includes("API_KEY_MISSING") || error.toString().includes("API_KEY_MISSING")) {
             console.warn("API Key missing during connection, resetting state.");
             setApiKeyState('MISSING');
             setConnectionState('ERROR');
             setMessages(prev => [...prev, { role: 'model', text: "Error: No se detectó la clave API. Por favor selecciónala nuevamente.", errorText: "API Key Missing" }]);
        } else {
             setMessages(prev => [...prev, { role: 'model', text: "Error al iniciar la sesión. Verifica tu conexión y clave API.", errorText: "Connection Failed" }]);
             setConnectionState('ERROR');
        }
        liveSessionRef.current = null;
      }
    };
    initializeLiveChatSession();
  }, [selectedModuleId, selectedCountry, apiKeyState, currentModule, handleStopSpeaking, retryCount, enablePronunciationFeedback]);

  const handleSelectApiKey = async () => {
    if (typeof (window as any).aistudio !== 'undefined' && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      setApiKeyState('PRESENT'); 
      setRetryCount(prev => prev + 1); // Force reconnection
    }
  };

  const handleFinishSession = async () => {
    if (messages.length < 2) {
      onNavigate(AppSection.HOME);
      return;
    }

    setIsAnalyzing(true);
    try {
      const transcript = messages
        .map(m => `${m.role === 'user' ? 'Student' : 'Carolina'}: ${m.text}`)
        .join('\n');
      
      const result = await geminiService.analyzeChatSession(selectedModuleId, transcript);
      setSummary(result);
      
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
      }
      setConnectionState('DISCONNECTED');
    } catch (e) {
      console.error("Error finishing session:", e);
      onNavigate(AppSection.HOME);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryConnection = () => {
    setRetryCount(prev => prev + 1);
  };

  const toggleMicInput = async () => {
    if (audioStreamActive) {
      // Stop streaming
      if (inputScriptProcessorRef.current) {
        try { inputScriptProcessorRef.current.disconnect(); } catch(e) {}
        inputScriptProcessorRef.current.onaudioprocess = null;
      }
      if (inputSourceNodeRef.current) {
        try { inputSourceNodeRef.current.disconnect(); } catch(e) {}
      }
      if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        try { await inputAudioContextRef.current.suspend(); } catch(e) {}
      }
      setAudioStreamActive(false);
      // End the turn for the Live API
      if (liveSessionRef.current) {
        try {
          liveSessionRef.current.sendRealtimeInput({ activityEnd: {} }); // Manual turn-taking end signal
          setIsSending(true); // Indicate waiting for model response
        } catch (e) {
          console.error("Error sending end-of-turn message (LATAM):", e);
        }
      }
      handleStopSpeaking(); // Stop any bot speech when user mic is turned off
    } else {
      // Start streaming
      if (isSending) return; // Prevent starting while AI is processing
      
      if (!liveSessionRef.current) {
        console.error("Live session not initialized (LATAM). Cannot start mic.");
        if (connectionState === 'CONNECTING') {
             setMessages(prev => [...prev, { role: 'model', text: "Conectando con Carolina LATAM... Por favor espera un momento." }]);
        } else if (connectionState === 'ERROR') {
             setMessages(prev => [...prev, { role: 'model', text: "Error de conexión. Por favor intenta recargar o verificar tu clave API." }]);
        } else {
             setMessages(prev => [...prev, { role: 'model', text: "El chat no está listo. Intenta recargar la página." }]);
        }
        return;
      }

      handleStopSpeaking(); // Stop any existing bot speech
      setIsSending(false); // Reset sending state

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        if (liveSessionRef.current) {
          try {
             liveSessionRef.current.sendRealtimeInput({ activityStart: {} }); // Manual turn-taking start signal
          } catch (e) {}
        }
        
        if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
          inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        }
        
        if (inputAudioContextRef.current.state === 'suspended') {
          await inputAudioContextRef.current.resume();
        }

        inputSourceNodeRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
        inputScriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

        inputScriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createPcmBlob(inputData);
          if (liveSessionRef.current && liveSessionRef.current.sendRealtimeInput) {
            try {
              liveSessionRef.current.sendRealtimeInput({ media: pcmBlob });
            } catch (err) {
              console.error("Error sending audio data (LATAM):", err);
            }
          }
        };

        inputSourceNodeRef.current.connect(inputScriptProcessorRef.current);
        inputScriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
        setAudioStreamActive(true);
        console.log("Microphone input started, streaming to Live API (LATAM).");

        // Clear previous transcriptions
        currentInputTranscription.current = '';
        currentOutputTranscription.current = '';
        // Add an empty placeholder message for user input that will be filled by streaming transcription
        setMessages(prev => [...prev, { role: 'user', text: "" }]);

      } catch (err) {
        console.error("Error accessing microphone (LATAM):", err);
        setMessages(prev => [...prev, { role: 'model', text: "Error al acceder al micrófono. Por favor, asegúrate de haber dado permiso.", errorText: (err as Error).message }]);
        setAudioStreamActive(false);
      }
    }
  };


  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !currentModule) return; 

    handleStopSpeaking();
    setIsSending(true);
    setInput('');

    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    
    if (liveSessionRef.current) {
        try {
            // Send text message via Live API (this acts as a user turn)
            liveSessionRef.current.sendRealtimeInput({ message: { message: messageText } });
            // The Live API's onmessage callback will handle displaying the bot's response.
        } catch (error) {
            console.error("Error sending text message to Live API (LATAM):", error);
            setMessages(prev => [...prev, { role: 'model', text: "Error al enviar mensaje de texto al chat en vivo LATAM." }]);
            setIsSending(false);
        }
    } else {
        setMessages(prev => [...prev, { role: 'model', text: "La sesión de chat en vivo LATAM no está activa." }]);
        setIsSending(false);
    }
    scrollToBottom();
  };

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModuleId = parseInt(event.target.value, 10);
    setSelectedModuleId(newModuleId);
    // useEffect will trigger re-initialization
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value as LatamCountry;
    setSelectedCountry(newCountry);
    // useEffect will trigger re-initialization
  };

  // Helper to render message text with red errors
  const renderMessageText = (text: string) => {
    const parts = text.split(/(\[ERROR:.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[ERROR:')) {
        const errorMessage = part.replace('[ERROR:', '').replace(']', '').trim();
        return (
          <span key={i} className="text-red-600 font-black underline decoration-2 decoration-red-400 bg-red-50 px-2 py-1 rounded-lg inline-block my-1 animate-pulse">
            {errorMessage}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-12 animate-in fade-in duration-700 max-w-full mx-auto pb-16 sm:pb-32 w-full h-full">
      <button onClick={() => onNavigate(AppSection.HOME)} className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red">
        <ArrowLeft size={16}/> Volver al Dashboard
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-[3rem] border-4 border-spanish-gold/20 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <ZayroBotIcon size={80} />
            <div>
               <h3 className="font-brand font-black text-2xl sm:text-3xl text-gray-800 tracking-tight uppercase">ZayroLingua <span className="text-spanish-red">LATAM</span></h3>
               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                 <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[9px] tracking-widest flex items-center gap-2">
                   IA con acento de {selectedCountry} {latamCountries.find(c => c.name === selectedCountry)?.flag}
                   <span className="text-spanish-red/40 ml-2">v1.2.3</span>
                 </p>
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${connectionState === 'CONNECTED' ? 'bg-green-500 animate-pulse' : connectionState === 'CONNECTING' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} title={connectionState}></div>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                     {connectionState === 'CONNECTED' ? 'Carolina en línea' : connectionState === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
                   </span>
                   {connectionState === 'DISCONNECTED' && (
                     <button 
                       onClick={() => setRetryCount(prev => prev + 1)} 
                       className="text-[9px] font-black text-spanish-red uppercase tracking-widest hover:underline flex items-center gap-1"
                     >
                       <RefreshCw size={10} /> Reconectar
                     </button>
                   )}
                 </div>
               </div>
            </div>
         </div>
      </div>

      {apiKeyState === 'MISSING' && (
        <div className="bg-red-50 p-6 rounded-[2rem] border-2 border-red-200 text-red-700 flex items-start gap-4">
          <AlertCircle size={24} />
          <div>
            <h4 className="font-brand font-black text-lg uppercase">¡Falta la API Key!</h4>
            <button onClick={handleSelectApiKey} className="mt-4 bg-red-500 text-white px-6 py-3 rounded-xl font-brand font-bold text-xs uppercase shadow-md">Seleccionar API Key</button>
          </div>
        </div>
      )}

      {connectionState === 'ERROR' && apiKeyState === 'PRESENT' && (
         <div className="bg-red-50 p-4 rounded-[2rem] border-2 border-red-200 text-red-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="font-brand font-bold text-xs uppercase">Error de conexión</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRetryConnection} className="bg-red-500 text-white px-4 py-2 rounded-xl font-brand font-bold text-[10px] uppercase shadow-md hover:bg-red-600">Reintentar</button>
              <button onClick={() => window.location.reload()} className="bg-white text-red-500 border border-red-200 px-4 py-2 rounded-xl font-brand font-bold text-[10px] uppercase shadow-md hover:bg-red-50">Recargar</button>
            </div>
         </div>
      )}

      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-3xl md:rounded-[3rem] shadow-xl border border-gray-100 flex flex-col min-h-[calc(100vh - 12rem)] md:h-[70vh]">
        {summary ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 animate-in zoom-in-95 duration-500">
            <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border-t-[12px] border-emerald-500">
              <div className="p-10 text-center bg-emerald-50/50">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-white rounded-3xl mb-6 shadow-xl">
                  <Trophy size={40} />
                </div>
                <h2 className="text-4xl font-brand font-black text-gray-800 uppercase tracking-tight mb-2">Zayrolingua Summary</h2>
                <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">¡Excelente trabajo hoy!</p>
              </div>

              <div className="p-10 space-y-10">
                {/* Strengths */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <Sparkles size={24} />
                    <h3 className="font-brand font-black uppercase tracking-widest text-lg">Great Job!</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100/50">
                    {summary.strengths}
                  </p>
                </section>

                {/* Corrections */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-spanish-red">
                    <RefreshCw size={24} />
                    <h3 className="font-brand font-black uppercase tracking-widest text-lg">Say it Better</h3>
                  </div>
                  <div className="space-y-4">
                    {summary.corrections.map((c, i) => (
                      <div key={i} className="bg-rose-50/30 p-6 rounded-3xl border border-rose-100/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-rose-400 uppercase tracking-widest">You said:</span>
                          <span className="text-gray-800 font-medium italic">"{c.said}"</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Better:</span>
                          <span className="text-emerald-700 font-bold">"{c.better}"</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-snug">{c.why}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mission */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-600">
                    <CheckCircle size={24} />
                    <h3 className="font-brand font-black uppercase tracking-widest text-lg">Module Mission</h3>
                  </div>
                  <div className="flex items-center justify-between bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50">
                    <p className="text-gray-700 font-medium">{summary.missionFeedback}</p>
                    <span className={`px-4 py-2 rounded-full font-brand font-black text-xs uppercase tracking-widest ${
                      summary.missionStatus.includes('✅') ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {summary.missionStatus}
                    </span>
                  </div>
                </section>

                {/* Pro Words */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Volume2 size={24} />
                    <h3 className="font-brand font-black uppercase tracking-widest text-lg">Your Pro Words</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {summary.proWords.map((word, i) => (
                      <span key={i} className="bg-amber-100 text-amber-800 px-6 py-3 rounded-2xl font-brand font-black uppercase text-sm shadow-sm border border-amber-200">
                        {word}
                      </span>
                    ))}
                  </div>
                </section>

                <button 
                  onClick={() => onNavigate(AppSection.HOME)}
                  className="w-full py-6 bg-spanish-red text-white rounded-3xl font-brand font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
                >
                  Continuar Aprendiendo
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-wrap items-center gap-8 shadow-inner">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Seleccionar Acento</span>
                <div className="flex flex-wrap gap-2">
                  {latamCountries.map(c => (
                    <button
                      key={c.name}
                      onClick={() => handleCountryChange({ target: { value: c.name } } as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${selectedCountry === c.name ? 'bg-spanish-red text-white border-spanish-red shadow-lg scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-spanish-red/30'}`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-10 w-px bg-gray-200 hidden md:block"></div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Configuración</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="pronunciationFeedbackToggle"
                      checked={enablePronunciationFeedback}
                      onChange={(e) => setEnablePronunciationFeedback(e.target.checked)}
                      className="h-5 w-5 text-spanish-red rounded-lg border-gray-300 focus:ring-spanish-red cursor-pointer"
                    />
                    <label htmlFor="pronunciationFeedbackToggle" className="text-xs font-black uppercase text-gray-600 cursor-pointer select-none">Feedback de Pronunciación</label>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lección:</span>
                    <select value={selectedModuleId} onChange={handleModuleChange} className="bg-transparent text-gray-800 font-bold text-xs cursor-pointer outline-none">
                      {MODULES.map((module) => (
                        <option key={module.id} value={module.id} disabled={isFreeUser && module.id !== 1}>{module.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border border-gray-200 shadow-sm">
                      {userProfileImage ? <img src={userProfileImage} alt="User" className="w-full h-full object-cover" /> : <UserCircle size={40} className="text-gray-300" />}
                    </div>
                  )}
                  <div className={`p-5 px-6 rounded-3xl ${msg.role === 'user' ? 'bg-spanish-red text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {renderMessageText(msg.text)}
                  </div>
                  {msg.role === 'model' && <ZayroBotIcon size={40} className="shrink-0" />}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex items-center gap-6">
              <button onClick={handleStopSpeaking} disabled={!isSpeaking} className={`p-3 rounded-full ${isSpeaking ? 'bg-spanish-gold text-white animate-pulse' : 'bg-gray-100 text-gray-300'}`}>
                <Volume2 size={24} />
              </button>
              <button onClick={() => speakTextManually("Prueba de audio. Uno, dos, tres.")} className="text-[10px] text-gray-400 font-bold uppercase hover:text-spanish-red">Test</button>
              <button onClick={toggleMicInput} disabled={connectionState !== 'CONNECTED'} className={`p-3 rounded-full ${audioStreamActive ? 'bg-blue-500 text-white animate-pulse' : connectionState === 'CONNECTED' ? 'bg-gray-100 text-gray-300' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {connectionState === 'CONNECTING' ? <Loader2 size={24} className="animate-spin text-gray-500" /> : audioStreamActive ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)} placeholder="Escribe tu mensaje..." className="flex-1 p-4 rounded-2xl bg-gray-50 outline-none" disabled={isSending || audioStreamActive || apiKeyState !== 'PRESENT'} />
              <button onClick={() => sendMessage(input)} className="p-4 rounded-2xl bg-spanish-red text-white shadow-lg" disabled={!input.trim() || isSending || audioStreamActive || apiKeyState !== 'PRESENT'}><Send size={24} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
