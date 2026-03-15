
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, Zap, Car, Heart, ShieldAlert, ArrowLeft, 
  Send, Loader2, Skull, Trophy, Sparkles, UserCircle,
  Mic, MicOff, Volume2, Briefcase, Users, MapPin, 
  ShoppingBag, Stethoscope, Dumbbell, Plane, Camera,
  Languages
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ZayroBotIcon } from './ZayroBotIcon';
import { AppSection, Message, LanguageOption } from '../types';

interface ChallengeZoneProps {
  onNavigate: (section: AppSection) => void;
  selectedLanguage?: LanguageOption;
}

interface Mission {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  module: number;
  consequence: string;
  initialMessage: string;
}

const MISSIONS: Mission[] = [
  // Module 1
  { id: 'm1_party', title: 'At the Party', subtitle: 'Socialize and make friends', icon: <Users size={24}/>, module: 1, consequence: 'If you are too quiet, you will end up alone.', initialMessage: '¡Hola! Qué buena música hay aquí, ¿verdad? Yo soy Daniel, ¿cómo te llamas?' },
  { id: 'm1_class', title: 'First Day of Class', subtitle: 'Meet your classmates', icon: <Briefcase size={24}/>, module: 1, consequence: 'If you don’t introduce yourself well, no one will study with you.', initialMessage: '¡Hola! Perdona, ¿este asiento está libre? Soy nuevo en la clase de español.' },
  { id: 'm1_reg', title: 'Registration Desk', subtitle: 'Academy paperwork', icon: <Briefcase size={24}/>, module: 1, consequence: 'Incorrect data means your registration will be rejected.', initialMessage: 'Buenos días. Necesito sus datos para el registro: nombre, apellido y correo electrónico.' },
  
  // Module 2
  { id: 'm2_neighbor', title: 'New Neighbor', subtitle: 'Create a good impression', icon: <Users size={24}/>, module: 2, consequence: 'A bad start and the neighbor might be noisy on purpose!', initialMessage: '¡Hola! Acabo de mudarme al piso de arriba. Me llamo Carlos, ¡mucho gusto!' },
  { id: 'm2_photo', title: 'Family Photo', subtitle: 'Describe your family', icon: <Camera size={24}/>, module: 2, consequence: 'If you get names wrong, you might offend your aunt!', initialMessage: 'Mira esta foto de mi familia. ¿Quiénes crees que son estas personas?' },
  { id: 'm2_guide', title: 'The Friendly Tourist', subtitle: 'Help someone lost', icon: <MapPin size={24}/>, module: 2, consequence: 'Wrong directions will lead the tourist to the wrong place.', initialMessage: '¡Perdón! Estoy muy perdido. ¿Podrías decirme qué lugares interesantes hay en esta ciudad?' },
  { id: 'm2_danger', title: 'Asking for Help', subtitle: 'Dangerous zone help', icon: <ShieldAlert size={24}/>, module: 2, consequence: 'If you don’t speak clearly, help might not arrive in time.', initialMessage: '¡Oye! Esta zona es un poco insegura a esta hora. ¿A dónde intentas ir?' },

  // Module 3
  { id: 'm3_restaurant', title: 'At the Restaurant', subtitle: 'Order your dinner', icon: <Briefcase size={24}/>, module: 3, consequence: 'Order wrong and you’ll eat something you dislike.', initialMessage: 'Buenas noches. ¿Tienen reserva? ¿Qué les gustaría ordenar para cenar?' },
  { id: 'm3_fakefriends', title: 'Fake Friends', subtitle: 'Detect sarcasm and irony', icon: <Users size={24}/>, module: 3, consequence: 'If you don’t get the irony, they might laugh at you.', initialMessage: '¡Vaya! Qué "lindo" tu atuendo hoy... ¿te lo regaló tu abuela?' },
  { id: 'm3_lost', title: 'Lost Tourist', subtitle: 'Find your way back', icon: <MapPin size={24}/>, module: 3, consequence: 'Misunderstanding signs means you will sleep at the station.', initialMessage: 'Disculpe, la estación central está muy lejos. Debe girar a la derecha, ¿entiende?' },
  { id: 'm3_market', title: 'At the Market', subtitle: 'Haggle for prices', icon: <ShoppingBag size={24}/>, module: 3, consequence: 'Poor negotiation means you’ll pay double the price.', initialMessage: '¡Pase! Tenemos las mejores frutas. Este kilo de manzanas cuesta diez euros, ¿se los lleva?' },

  // Module 4
  { id: 'm4_checkin', title: 'Airport Check-in', subtitle: 'Fly without issues', icon: <Plane size={24}/>, module: 4, consequence: 'Vague answers will lead to a missed flight.', initialMessage: 'Buenos días. Su pasaporte, por favor. ¿Lleva alguna maleta para facturar?' },
  { id: 'm4_security', title: 'Security Control', subtitle: 'Solve the misunderstanding', icon: <ShieldAlert size={24}/>, module: 4, consequence: 'You could end up in the interrogation room!', initialMessage: '¡Deténgase! El escáner detectó algo prohibido en su mochila. ¿Qué es esto?' },
  { id: 'm4_clothesshop', title: 'Clothes Shop', subtitle: 'Shop with style', icon: <ShoppingBag size={24}/>, module: 4, consequence: 'If you don’t ask for the right size, nothing will fit.', initialMessage: '¿Puedo ayudarle en algo? Tenemos una oferta en camisas y pantalones hoy.' },
  { id: 'm4_broken', title: 'Product Return', subtitle: 'Handle a broken item', icon: <ShoppingBag size={24}/>, module: 4, consequence: 'If you aren’t firm, they won’t give your money back.', initialMessage: 'Lo siento, pero sin el recibo no podemos aceptar la devolución de este televisor.' },

  // Module 5
  { id: 'm5_doctor', title: 'Doctor Appointment', subtitle: 'Explain your pain', icon: <Stethoscope size={24}/>, module: 5, consequence: 'A bad description means the wrong medicine.', initialMessage: 'Hola. Dígame, ¿dónde le duele exactamente y desde hace cuánto?' },
  { id: 'm5_pharmacy', title: 'At the Pharmacy', subtitle: 'Buy your meds', icon: <Stethoscope size={24}/>, module: 5, consequence: 'Wrong dosage request can be dangerous.', initialMessage: 'Buenas tardes. ¿Tiene receta para este medicamento? ¿Sabe cómo tomarlo?' },
  { id: 'm5_trainer', title: 'Personal Trainer', subtitle: 'Get in shape', icon: <Dumbbell size={24}/>, module: 5, consequence: 'If you don’t listen, you’ll end up with an injury!', initialMessage: '¡Vamos! Diez sentadillas más. Mantén la espalda recta o te harás daño. ¿Puedes seguir?' }
];

const JAPANESE_MISSIONS: Mission[] = [
  // Modulo 1
  { id: 'm1_party_jp', title: 'En la Fiesta', subtitle: 'Socializa y haz amigos', icon: <Users size={24}/>, module: 1, consequence: 'Si eres muy callado, terminarás solo.', initialMessage: 'こんにちは！いい音楽ですね。私はダニエルです。お名前は何ですか？ (Konnichiwa! Ii ongaku desu ne. Watashi wa Daniel desu. O-namae wa nan desu ka?)' },
  { id: 'm1_class_jp', title: 'Primer Día de Clase', subtitle: 'Conoce a tus compañeros', icon: <Briefcase size={24}/>, module: 1, consequence: 'Si no te presentas bien, nadie estudiará contigo.', initialMessage: 'すみません、この席は空いていますか？私は日本語クラスの新入生です。 (Sumimasen, kono seki wa aite imasu ka? Watashi wa nihongo kurasu no shinnyuusei desu.)' },
  { id: 'm1_reg_jp', title: 'Mesa de Registro', subtitle: 'Trámites de la academia', icon: <Briefcase size={24}/>, module: 1, consequence: 'Datos incorrectos significan que tu registro será rechazado.', initialMessage: 'おはようございます。登録のためにあなたのデータが必要です：名前、名字、メールアドレス。 (Ohayou gozaimasu. Touroku no tame ni anata no deeta ga hitsuyou desu: namae, myouji, meeru adoresu.)' },
  
  // Modulo 2
  { id: 'm2_neighbor_jp', title: 'Nuevo Vecino', subtitle: 'Crea una buena impresión', icon: <Users size={24}/>, module: 2, consequence: '¡Un mal comienzo y el vecino podría ser ruidoso a propósito!', initialMessage: 'こんにちは！上の階に引っ越してきました。カルロスです、よろしくお願いします！ (Konnichiwa! Ue no kai ni hikkoshite kimashita. Karurosu desu, yoroshiku onegaishimasu!)' },
  { id: 'm2_photo_jp', title: 'Foto Familiar', subtitle: 'Describe a tu familia', icon: <Camera size={24}/>, module: 2, consequence: '¡Si te equivocas de nombre, podrías ofender a tu tía!', initialMessage: '私の家族の写真を見てください。この人たちは誰だと思いますか？ (Watashi no kazoku no shashin o mite kudasai. Kono hitotachi wa dare da to omoimasu ka?)' },
  { id: 'm2_guide_jp', title: 'El Turista Amigable', subtitle: 'Ayuda a alguien perdido', icon: <MapPin size={24}/>, module: 2, consequence: 'Direcciones equivocadas llevarán al turista al lugar equivocado.', initialMessage: 'すみません！道に迷ってしまいました。この街で面白い場所はどこですか？ (Sumimasen! Michi ni mayotte shimaimashita. Kono machi de omoshiroi basho wa doko desu ka?)' },
  
  // Modulo 3
  { id: 'm3_restaurant_jp', title: 'En el Restaurante', subtitle: 'Pide tu cena', icon: <Briefcase size={24}/>, module: 3, consequence: 'Pide mal y comerás algo que no te gusta.', initialMessage: 'こんばんは。予約はありますか？夕食に何を注文したいですか？ (Konbanwa. Yoyaku wa arimasu ka? Yuushoku ni nani o chuumon shitai desu ka?)' },
  { id: 'm3_market_jp', title: 'En el Mercado', subtitle: 'Regatea precios', icon: <ShoppingBag size={24}/>, module: 3, consequence: 'Una mala negociación significa que pagarás el doble.', initialMessage: 'いらっしゃいませ！最高の果物がありますよ。このリンゴ1キロは1000円です。買いますか？ (Irasshaimase! Saikou no kudamono ga arimasu yo. Kono ringo ichi-kiro wa sen-en desu. Kaimasu ka?)' },
  
  // Modulo 4
  { id: 'm4_checkin_jp', title: 'Check-in en el Aeropuerto', subtitle: 'Vuela sin problemas', icon: <Plane size={24}/>, module: 4, consequence: 'Respuestas vagas te harán perder el vuelo.', initialMessage: 'おはようございます。パスポートをお願いします。預ける荷物はありますか？ (Ohayou gozaimasu. Pasupooto o onegaishimasu. Azukeru nimotsu wa arimasu ka?)' },
  { id: 'm4_security_jp', title: 'Control de Seguridad', subtitle: 'Resuelve el malentendido', icon: <ShieldAlert size={24}/>, module: 4, consequence: '¡Podrías terminar en la sala de interrogatorios!', initialMessage: '止まってください！スキャナーがカバンの中に禁止物を見つけました。これは何ですか？ (Tomatte kudasai! Sukyanaa ga kaban no naka ni kinshibutsu o mitsukemashita. Kore wa nan desu ka?)' },
  
  // Modulo 5
  { id: 'm5_doctor_jp', title: 'Cita con el Médico', subtitle: 'Explica tu dolor', icon: <Stethoscope size={24}/>, module: 5, consequence: 'Una mala descripción significa la medicina equivocada.', initialMessage: 'こんにちは。どこが痛いですか？いつからですか？ (Konnichiwa. Doko ga itai desu ka? Itsu kara desu ka?)' },
  { id: 'm5_trainer_jp', title: 'Entrenador Personal', subtitle: 'Ponte en forma', icon: <Dumbbell size={24}/>, module: 5, consequence: '¡Si no escuchas, terminarás con una lesión!', initialMessage: 'さあ！あと10回スクワットです。背中を真っ直ぐにしてください。続けられますか？ (Saa! Ato jukkai sukuwatto desu. Senaka o massugu ni shite kudasai. Tsuzukeraremasu ka?)' }
];

export const ChallengeZone: React.FC<ChallengeZoneProps> = ({ onNavigate, selectedLanguage }) => {
  const isJapanese = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH;
  const missions = isJapanese ? JAPANESE_MISSIONS : MISSIONS;
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [messages, setMessages] = useState<(Message & { translation?: string })[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [gameState, setGameState] = useState<'PLAYING' | 'GAME_OVER' | 'SUCCESS'>('PLAYING');
  const [chatSession, setChatSession] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch(e) {}
      currentAudioSourceRef.current.disconnect();
      currentAudioSourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speakMessage = useCallback(async (text: string) => {
    stopCurrentAudio();
    if (!outputAudioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      outputGainNodeRef.current = outputAudioContextRef.current.createGain();
      outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);
    }

    setIsSpeaking(true);
    try {
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }
      
      // Detect if text contains Japanese characters to use correct voice
      const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
      const langCode = hasJapanese ? 'ja-JP' : 'es-ES';
      
      const result = await geminiService.generateSpeech(text, langCode);
      if (result.audioData) {
        const buffer = await geminiService.decodePcmAudioData(
          geminiService.decodeBase64(result.audioData),
          outputAudioContextRef.current,
          24000,
          1
        );
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(outputGainNodeRef.current!);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
        currentAudioSourceRef.current = source;
      }
    } catch (e) {
      setIsSpeaking(false);
    }
  }, [stopCurrentAudio]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = isJapanese ? 'ja-JP' : 'es-ES';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => {
      stopCurrentAudio();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, [stopCurrentAudio]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopCurrentAudio();
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const startMission = async (mission: Mission) => {
    setMessages([]);
    setGameState('PLAYING');
    setIsSending(true);
    setActiveMission(mission);
    
    try {
      const session = await geminiService.startChallengeEngine(mission.id, selectedLanguage);
      setChatSession(session);
      setMessages([{ role: 'model', text: mission.initialMessage }]);
      speakMessage(mission.initialMessage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleTranslate = async (index: number) => {
    const msg = messages[index];
    if (msg.translation || msg.role === 'user') return;

    try {
      const translation = await geminiService.translateToEnglish(msg.text);
      setMessages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], translation };
        return updated;
      });
    } catch (e) {
      console.error("Translation failed", e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending || !chatSession) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsSending(true);
    stopCurrentAudio();

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const responseText = result.text || "";
      
      if (responseText.includes('[FRACASO]')) setGameState('GAME_OVER');
      if (responseText.includes('[EXITO]')) setGameState('SUCCESS');
      
      const cleanText = responseText.replace('[FRACASO]', '').replace('[EXITO]', '').trim();
      setMessages(prev => [...prev, { role: 'model', text: cleanText }]);
      speakMessage(cleanText);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, hubo un error de conexión. Inténtalo de nuevo." }]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeMission) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700 pb-32">
        <button onClick={() => onNavigate(AppSection.HOME)} className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red transition-colors">
          <ArrowLeft size={16}/> Back to Dashboard
        </button>

        <div className={`bg-spanish-dark p-12 rounded-[4rem] shadow-2xl relative overflow-hidden text-white border-t-[20px] ${isJapanese ? 'border-emerald-500' : 'border-spanish-red'}`}>
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Zap size={240} className={isJapanese ? 'text-emerald-500' : 'text-spanish-gold'} />
          </div>
          <div className="relative z-10 max-w-3xl">
             <div className="flex items-center gap-4 bg-white/10 w-fit px-6 py-2 rounded-full border border-white/20 mb-8">
                <Flame size={20} className="text-orange-500 animate-pulse" />
                <span className="font-black text-[10px] uppercase tracking-widest">{isJapanese ? 'Efecto Mariposa' : 'Butterfly Effect Engine'}</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-brand font-black uppercase tracking-tighter leading-none mb-6">
                Challenge <span className={isJapanese ? 'text-emerald-500' : 'text-spanish-gold'}>Zone</span>
             </h2>
             <p className="text-gray-400 font-bold text-xl italic leading-relaxed">
               {isJapanese 
                 ? 'Bienvenido al laboratorio de inmersión. Aquí, tu japonés tiene consecuencias sociales. Elige una misión de tu módulo e intenta lograr el objetivo hablando.'
                 : 'Welcome to the immersion lab. Here, your Spanish has social consequences. Choose a mission from your module and try to achieve the goal by speaking.'}
             </p>
          </div>
        </div>

        {[1, 2, 3, 4, 5].map(modNum => (
          <div key={modNum} className="space-y-6">
            <h3 className={`font-brand font-black text-2xl ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} uppercase tracking-widest flex items-center gap-4`}>
              <Sparkles size={24}/> {isJapanese ? 'Módulo' : 'Module'} {modNum}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {missions.filter(m => m.module === modNum).map(mission => (
                <button 
                  key={mission.id} 
                  onClick={() => startMission(mission)}
                  className={`bg-white p-8 rounded-[3rem] shadow-xl border-b-8 border-gray-100 transition-all hover:scale-105 ${isJapanese ? 'hover:border-emerald-500' : 'hover:border-spanish-gold'} group text-left flex flex-col h-full`}
                >
                  <div className={`bg-gray-50 p-4 rounded-2xl ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} w-fit mb-6 group-hover:rotate-12 transition-transform shadow-inner`}>
                    {mission.icon}
                  </div>
                  <h4 className="font-brand font-black text-lg text-gray-800 uppercase tracking-tight mb-2">{mission.title}</h4>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">{mission.subtitle}</p>
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <p className="text-[9px] text-red-500 font-black uppercase tracking-tighter">{isJapanese ? 'Consecuencia:' : 'Consequence:'}</p>
                    <p className="text-[10px] text-gray-500 italic leading-tight">{mission.consequence}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 pb-32">
       <div className="flex items-center justify-between">
          <button onClick={() => setActiveMission(null)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red flex items-center gap-2">
            <ArrowLeft size={16}/> Abort Mission
          </button>
          <div className="bg-spanish-dark text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-xl">
             <div className={`w-2 h-2 rounded-full ${isJapanese ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
             {isJapanese ? 'Escenario:' : 'Scenario:'} {activeMission.title.toUpperCase()}
          </div>
       </div>

       <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-[70vh] border-8 border-white">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                  {msg.role === 'model' && <ZayroBotIcon size={40} className="shrink-0" />}
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className={`p-6 rounded-3xl font-medium shadow-sm relative group ${msg.role === 'user' ? (isJapanese ? 'bg-emerald-500 text-white rounded-br-none shadow-lg' : 'bg-spanish-red text-white rounded-br-none shadow-lg') : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                      {msg.text}
                      {msg.role === 'model' && (
                        <button 
                          onClick={() => handleTranslate(idx)}
                          className={`absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-md ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} border border-gray-100 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100`}
                          title={isJapanese ? "Traducir al Español" : "Translate to English"}
                        >
                          <Languages size={14} />
                        </button>
                      )}
                    </div>
                    {msg.translation && (
                      <div className="text-[10px] text-gray-400 italic px-4 animate-in slide-in-from-top-1">
                        "{msg.translation}"
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && <UserCircle size={40} className="text-gray-300 shrink-0" />}
               </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-white border-t border-gray-100">
             {gameState === 'PLAYING' ? (
                <div className="flex gap-4 items-center">
                   <button 
                     onClick={toggleListening}
                     className={`p-6 rounded-2xl shadow-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                     title="Speak"
                   >
                     {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                   </button>
                   <input 
                     type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder={isListening ? (isJapanese ? "Escuchando..." : "Listening...") : (isJapanese ? "Habla en japonés..." : "Habla en español...")} 
                     className="flex-1 p-6 rounded-2xl bg-gray-50 outline-none font-medium border-2 border-transparent focus:border-spanish-gold/30 transition-all shadow-inner"
                     disabled={isSending}
                   />
                   <button 
                     onClick={sendMessage} 
                     disabled={!input.trim() || isSending}
                     className={`${isJapanese ? 'bg-emerald-500' : 'bg-spanish-red'} text-white p-6 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-30`}
                   >
                     {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                   </button>
                </div>
             ) : (
                <div className={`p-10 rounded-[3rem] text-center animate-in slide-in-from-bottom-5 border-4 ${gameState === 'GAME_OVER' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                   {gameState === 'GAME_OVER' ? <Skull size={64} className="text-red-500 mx-auto mb-6" /> : <Trophy size={64} className="text-green-500 mx-auto mb-6" />}
                   <h3 className={`text-4xl font-brand font-black uppercase mb-4 ${gameState === 'GAME_OVER' ? 'text-red-600' : 'text-green-600'}`}>
                     {gameState === 'GAME_OVER' ? 'Mission Failed' : 'Mission Success'}
                   </h3>
                   <p className="text-gray-500 font-bold mb-8">
                     {gameState === 'GAME_OVER' ? "Your words had negative consequences. Try again!" : "Congratulations! You handled the situation like a pro."}
                   </p>
                   <button onClick={() => setActiveMission(null)} className={`px-12 py-5 rounded-2xl font-brand font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 ${gameState === 'GAME_OVER' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                     Back to Panel
                   </button>
                </div>
             )}
          </div>
       </div>

       <div className="flex justify-center gap-4">
          <div className="bg-white/50 backdrop-blur-xl px-8 py-3 rounded-full border border-gray-200 flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-spanish-gold animate-ping' : 'bg-gray-300'}`}></div>
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
               {isSpeaking ? 'Carolina AI is speaking...' : 'Voice Engine Active'}
             </span>
          </div>
       </div>
    </div>
  );
};
