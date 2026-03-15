
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, AppSection, ZayroSummary, LanguageOption } from '../types';
import { geminiService, createPcmBlob } from '../services/geminiService'; 
import { MODULES } from '../constants';
import { ZayroBotIcon } from './ZayroBotIcon';
import { 
  Send, ArrowLeft, Loader2, Volume2, Mic, MicOff, 
  AlertCircle, UserCircle, RefreshCw, CheckCircle, Sparkles, Trophy
} from 'lucide-react'; 
import { LiveServerMessage } from '@google/genai'; 

interface ChatInterfaceProps {
  isFreeUser?: boolean;
  onNavigate: (section: AppSection) => void;
  selectedLanguage?: LanguageOption;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isFreeUser = false,
  onNavigate,
  selectedLanguage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStreamActive, setAudioStreamActive] = useState(false); 
  const [apiKeyState, setApiKeyState] = useState<'LOADING' | 'PRESENT' | 'MISSING' | 'REJECTED'>('LOADING');
  const [error, setError] = useState<string | null>(null);
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
          console.log("Sending keep-alive ping (Standard)...");
          try {
            liveSessionRef.current.sendRealtimeInput({ text: " " });
          } catch (e) {
            console.warn("Keep-alive ping failed (Standard):", e);
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
  
  const liveSessionRef = useRef<any | null>(null); 
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const inputScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null); 
  const isAudioPlaybackSupported = useRef(false); 
  let nextOutputAudioStartTime = useRef<number>(0); 

  const messagesEndRef = useRef<HTMLDivElement>(null); 
  const currentModule = MODULES.find(m => m.id === 1);

  const [userProfileImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zayrolingua_user_profile_image') || null;
    }
    return null;
  });

  const currentInputTranscription = useRef<string>('');
  const currentOutputTranscription = useRef<string>('');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleStopSpeaking = useCallback(() => {
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch(e) {}
      currentAudioSourceRef.current.disconnect();
      currentAudioSourceRef.current = null;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    nextOutputAudioStartTime.current = 0; 
  }, []);

  const getInitialBotMessageText = () => {
    if (selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH) {
      return `¡Hola! Soy Carolina AI, tu profesora de japonés. Hoy empezaremos con lo básico: Saludos y presentaciones. こんにちは (Konnichiwa) - ¿Estás listo para aprender?`;
    }
    if (selectedLanguage === LanguageOption.SPANISH_FOR_ENGLISH || selectedLanguage === LanguageOption.SPANISH_FOR_DUTCH) {
      return `Hi! I'm Carolina AI, your Spanish teacher. Here is how to study: Choose a module, watch videos 1, 2, and 3 today. Take notes in your notebook, then come back to me and let's practice together! What words or sentences did you write down?`;
    }
    return `¡Hola! Soy Carolina AI, tu profesora de español. Hoy practicaremos: Module 1: Introduce Yourself & Greetings. ¿Tienes alguna duda?`;
  };

  const speakTextManually = async (text: string) => {
    handleStopSpeaking();
    if (!outputAudioContextRef.current || !outputGainNodeRef.current) return;
    
    setIsSpeaking(true);
    try {
        if (outputAudioContextRef.current.state === 'suspended') {
            await outputAudioContextRef.current.resume();
        }
        const langCode = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH ? 'ja-JP' : 'es-ES';
        const speech = await geminiService.generateSpeech(text, langCode);
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
          throw new Error(speech.error?.message || "Gemini TTS Limit");
        }
    } catch (e: any) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH ? 'ja-JP' : 'es-ES';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectApiKey = async () => {
    if (typeof (window as any).aistudio !== 'undefined' && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      setApiKeyState('PRESENT'); 
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
      
      const result = await geminiService.analyzeChatSession(1, transcript, selectedLanguage);
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

  const connectToCarolina = async () => {
    if (!currentModule || apiKeyState !== 'PRESENT') return;
    
    setError(null);
    handleStopSpeaking();
    
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close(); } catch(e) {}
      liveSessionRef.current = null;
    }

    try {
      setConnectionState('CONNECTING');
      const sessionPromise = geminiService.connectLiveSession(
        currentModule.title, 
        currentModule.topics, 
        currentModule.id, 
        {
          onopen: () => {
            setError(null);
            const initialText = getInitialBotMessageText();
            if (messages.length === 0) {
              setMessages([{ role: 'model', text: initialText }]);
              speakTextManually(initialText);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const audioBase64 = message.serverContent.modelTurn.parts[0].inlineData.data;
              if (audioBase64 && outputAudioContextRef.current && outputGainNodeRef.current) {
                setIsSpeaking(true);
                try {
                  if (outputAudioContextRef.current.state === 'suspended') {
                    await outputAudioContextRef.current.resume();
                  }
                  nextOutputAudioStartTime.current = Math.max(nextOutputAudioStartTime.current, outputAudioContextRef.current.currentTime);
                  const buffer = await geminiService.decodePcmAudioData(
                    geminiService.decodeBase64(audioBase64),
                    outputAudioContextRef.current,
                    24000,
                    1
                  );
                  const source = outputAudioContextRef.current.createBufferSource();
                  source.buffer = buffer;
                  source.connect(outputGainNodeRef.current);
                  source.start(nextOutputAudioStartTime.current);
                  nextOutputAudioStartTime.current += buffer.duration;
                  currentAudioSourceRef.current = source;
                } catch(e) { setIsSpeaking(false); }
              }
            }

            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'model') return [...prev.slice(0, -1), { ...last, text: currentOutputTranscription.current }];
                return [...prev, { role: 'model', text: currentOutputTranscription.current }];
              });
            }

            if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'user') return [...prev.slice(0, -1), { ...last, text: currentInputTranscription.current }];
                return [...prev, { role: 'user', text: currentInputTranscription.current }];
              });
            }

            if (message.serverContent?.turnComplete) {
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
              setIsSpeaking(false);
              nextOutputAudioStartTime.current = 0;
            }

            if (message.serverContent?.interrupted) handleStopSpeaking();
            setIsSending(false);
            scrollToBottom();
          },
          onerror: (e: any) => {
            const msg = e?.message || "Servicio no disponible.";
            if (msg.includes("unavailable") || msg.includes("503") || msg.includes("429")) {
               setError("Google está experimentando alta demanda. Reintenta en unos segundos.");
            } else {
               setError(msg);
            }
          },
          onclose: (e: any) => {
            console.log('Gemini Live session closed (Standard):', e);
            setAudioStreamActive(false);
            handleStopSpeaking();
            liveSessionRef.current = null;
            setConnectionState('DISCONNECTED');
            
            // Auto-reconnect once if it was unexpected
            if (e?.code !== 1000 && retryCount < 3) {
              console.log("Unexpected close, attempting auto-reconnect (Standard)...");
              setRetryCount(prev => prev + 1);
            }
          }
        },
        undefined,
        false,
        selectedLanguage
      );
      liveSessionRef.current = await sessionPromise;
      setConnectionState('CONNECTED');
    } catch(e: any) {
      setConnectionState('ERROR');
      setError(e?.message || "Fallo al conectar.");
    }
  };

  useEffect(() => {
    if (window.AudioContext || (window as any).webkitAudioContext) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputGainNodeRef.current = outputAudioContextRef.current.createGain();
      outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);
      isAudioPlaybackSupported.current = true;
    }
    return () => {
      handleStopSpeaking();
      if (liveSessionRef.current) try { liveSessionRef.current.close(); } catch(e) {}
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, [handleStopSpeaking]);

  useEffect(() => {
    const checkKey = async () => {
      let present = !!(process.env.API_KEY || process.env.GEMINI_API_KEY);
      if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
        present = await (window as any).aistudio.hasSelectedApiKey();
      }
      setApiKeyState(present ? 'PRESENT' : 'MISSING');
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (apiKeyState === 'PRESENT') connectToCarolina();
  }, [apiKeyState]);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const toggleMic = async () => {
    if (error) return;
    
    if (audioStreamActive) {
      // Stop mic
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
      if (liveSessionRef.current) {
        try {
          liveSessionRef.current.sendRealtimeInput({ activityEnd: {} });
          setIsSending(true);
        } catch (e) {
          console.error("Error sending end-of-turn message:", e);
        }
      }
    } else {
      // Start mic
      if (isSending) return;
      if (!liveSessionRef.current) {
        setError("El chat no está conectado. Espera un momento.");
        return;
      }
      handleStopSpeaking();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (liveSessionRef.current) {
          try {
            liveSessionRef.current.sendRealtimeInput({ activityStart: {} });
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
        
        inputScriptProcessorRef.current.onaudioprocess = (e) => {
          const data = e.inputBuffer.getChannelData(0);
          const pcm = createPcmBlob(data);
          if (liveSessionRef.current && liveSessionRef.current.sendRealtimeInput) {
            try {
              liveSessionRef.current.sendRealtimeInput({ media: pcm });
            } catch (err) {
              console.error("Error sending audio data:", err);
            }
          }
        };
        
        inputSourceNodeRef.current.connect(inputScriptProcessorRef.current);
        inputScriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
        setAudioStreamActive(true);
        setMessages(prev => [...prev, { role: 'user', text: "" }]);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Acceso al micrófono denegado o error de hardware.");
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending || audioStreamActive) return;
    handleStopSpeaking();
    setIsSending(true);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    if (liveSessionRef.current) {
      liveSessionRef.current.sendRealtimeInput({ message: { message: text } });
    }
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
               <h3 className="font-brand font-black text-2xl sm:text-3xl text-gray-800 tracking-tight uppercase">Carolina <span className="text-spanish-red">AI</span></h3>
               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                 <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[9px] tracking-widest flex items-center gap-2">
                   Carolina AI <span className="text-spanish-red/40 ml-2">v1.2.3</span>
                 </p>
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${connectionState === 'CONNECTED' ? 'bg-green-500 animate-pulse' : connectionState === 'CONNECTING' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} title={connectionState}></div>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                     {connectionState === 'CONNECTED' ? 'Carolina en línea' : connectionState === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
                   </span>
                   {connectionState === 'CONNECTED' && (
                     <button 
                       onClick={handleFinishSession}
                       disabled={isAnalyzing}
                       className="ml-4 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-all font-brand font-black text-[9px] uppercase tracking-widest shadow-lg disabled:opacity-50"
                     >
                       {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                       Terminar Sesión
                     </button>
                   )}
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
         {apiKeyState === 'MISSING' && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100">
               <AlertCircle size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Falta API Key</span>
               <button onClick={handleSelectApiKey} className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">Seleccionar</button>
            </div>
         )}
         {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 animate-pulse">
               <AlertCircle size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
               <button onClick={connectToCarolina} className="ml-2 hover:rotate-180 transition-transform"><RefreshCw size={14} /></button>
            </div>
         )}
      </div>

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
              <button onClick={toggleMic} className={`p-3 rounded-full ${audioStreamActive ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-100 text-gray-300'}`}>
                {audioStreamActive ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)} 
                placeholder="Escribe tu mensaje..." 
                className="flex-1 p-4 rounded-2xl bg-gray-50 outline-none" 
                disabled={isSending || audioStreamActive || apiKeyState !== 'PRESENT'} 
              />
              <button 
                onClick={() => sendMessage(input)} 
                className="p-4 rounded-2xl bg-spanish-red text-white shadow-lg" 
                disabled={!input.trim() || isSending || audioStreamActive || apiKeyState !== 'PRESENT'}
              >
                {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
