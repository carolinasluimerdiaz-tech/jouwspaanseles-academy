
import React, { useState, useCallback, useRef } from 'react';
import { 
  Globe, ArrowLeft, Volume2, Loader2, CheckCircle2, 
  XCircle, Play, BookOpen, Trophy, Sparkles, Languages,
  MapPin, Utensils, Users, MessageSquare
} from 'lucide-react';
import { CULTURE_DATA, JAPANESE_CULTURE_DATA, CultureCountry, CultureQuestion } from '../constants/cultureData';
import { geminiService } from '../services/geminiService';
import { AppSection, LanguageOption } from '../types';

interface CultureSectionProps {
  onNavigate: (section: AppSection) => void;
  onExerciseComplete?: (action: string, xp: number) => void;
  selectedLanguage?: LanguageOption;
}

export const CultureSection: React.FC<CultureSectionProps> = ({ onNavigate, onExerciseComplete, selectedLanguage }) => {
  const [selectedCountry, setSelectedCountry] = useState<CultureCountry | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const data = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH ? JAPANESE_CULTURE_DATA : CULTURE_DATA;

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch(e) {}
      currentAudioSourceRef.current.disconnect();
      currentAudioSourceRef.current = null;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsAudioLoading(false);
  }, []);

  const speakText = useCallback(async (text: string) => {
    if (!text) return;
    stopCurrentAudio();
    
    if (!outputAudioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
        outputGainNodeRef.current = outputAudioContextRef.current.createGain();
        outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);
    }

    setIsAudioLoading(true);
    try {
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }
      const langCode = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH ? 'ja-JP' : 'es-ES';
      const speechResult = await geminiService.generateSpeech(text, langCode);
      if (speechResult.audioData) {
        const audioBuffer = await geminiService.decodePcmAudioData(
          geminiService.decodeBase64(speechResult.audioData),
          outputAudioContextRef.current,
          24000,
          1,
        );
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputGainNodeRef.current!);
        source.onended = () => { setIsSpeaking(false); };
        source.start(0);
        currentAudioSourceRef.current = source;
        setIsSpeaking(true);
      } else {
        throw new Error("TTS failed");
      }
    } catch (e: any) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH ? 'ja-JP' : 'es-ES';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsAudioLoading(false);
    }
  }, [stopCurrentAudio, selectedLanguage]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === selectedCountry?.questions[currentQuestionIndex].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < (selectedCountry?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResults(true);
        if (onExerciseComplete && selectedCountry) {
          onExerciseComplete(`Completed Culture Quiz: ${selectedCountry.name}`, score * 10);
        }
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-[4rem] shadow-2xl p-16 text-center space-y-10 animate-in zoom-in-95">
        <div className="relative inline-block">
          <Trophy size={120} className="text-spanish-gold mx-auto animate-bounce" />
          <Sparkles size={40} className="absolute -top-4 -right-4 text-spanish-red animate-pulse" />
        </div>
        <h2 className="text-5xl font-brand font-black text-gray-800 uppercase tracking-tighter">¡Excelente Trabajo!</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xl">Has completado el quiz de {selectedCountry?.name}</p>
        <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-6xl font-brand font-black text-spanish-red">{score} / {selectedCountry?.questions.length}</p>
          <p className="text-gray-400 font-black uppercase tracking-widest mt-4">Respuestas Correctas</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={resetQuiz} className="bg-gray-100 text-gray-800 px-12 py-6 rounded-[2rem] font-brand font-black uppercase shadow-xl hover:bg-gray-200 transition-all">Reintentar</button>
          <button onClick={() => { setSelectedCountry(null); resetQuiz(); }} className="bg-spanish-red text-white px-12 py-6 rounded-[2rem] font-brand font-black uppercase shadow-2xl hover:scale-105 transition-all">Explorar otros países</button>
        </div>
      </div>
    );
  }

  if (isQuizActive && selectedCountry) {
    const q = selectedCountry.questions[currentQuestionIndex];
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button onClick={resetQuiz} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red flex items-center gap-2"><ArrowLeft size={14}/> Salir del Quiz</button>
          <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-100 font-brand font-black text-spanish-red uppercase text-xs tracking-widest">
            Pregunta {currentQuestionIndex + 1} / {selectedCountry.questions.length}
          </div>
        </div>

        <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-3xl border-t-[20px] border-spanish-gold text-center space-y-12">
          <h3 className="text-4xl md:text-5xl font-brand font-black text-gray-800 uppercase leading-tight">{q.question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {q.options.map(opt => (
              <button 
                key={opt} 
                onClick={() => handleOptionSelect(opt)}
                disabled={selectedOption !== null}
                className={`p-8 rounded-[2.5rem] border-4 font-brand font-black text-xl transition-all shadow-sm ${
                  selectedOption === opt 
                    ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                    : (selectedOption !== null && opt === q.answer ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-800 border-gray-100 hover:border-spanish-gold')
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCountry) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedCountry(null)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red flex items-center gap-2"><ArrowLeft size={16}/> Volver a la lista</button>
          <div className="flex gap-4">
            <button 
              onClick={() => speakText(selectedCountry.text)}
              disabled={isAudioLoading}
              className={`w-14 h-14 bg-spanish-red text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
            >
              {isAudioLoading ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={28} />}
            </button>
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <Languages size={28} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-t-[20px] border-spanish-red space-y-8">
              <h2 className="text-4xl font-brand font-black text-gray-800 uppercase tracking-tighter">{selectedCountry.title}</h2>
              <div className="text-2xl font-brand font-black text-gray-800 leading-relaxed space-y-6">
                <p>{showTranslation ? selectedCountry.translation : selectedCountry.text}</p>
              </div>
              <button 
                onClick={() => setIsQuizActive(true)}
                className="w-full bg-spanish-gold text-white py-8 rounded-[2rem] font-brand font-black uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                Comenzar Ejercicio <Play size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><MapPin size={24} /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lugar más visitado</p>
                <p className="font-brand font-black text-gray-800">{selectedCountry.mostVisited}</p>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Utensils size={24} /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comida Típica</p>
                <p className="font-brand font-black text-gray-800">{selectedCountry.food}</p>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">La Gente</p>
                <p className="font-brand font-black text-gray-800">{selectedCountry.people}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-t-8 border-spanish-gold space-y-8">
              <div className="flex items-center gap-4">
                <MessageSquare className="text-spanish-red" size={32} />
                <h4 className="font-brand font-black text-xl text-gray-800 uppercase">Palabras Locales</h4>
              </div>
              <div className="space-y-6">
                {selectedCountry.localWords.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 group hover:bg-spanish-gold/5 transition-all">
                    <p className="font-brand font-black text-2xl text-spanish-red uppercase">{item.word}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-brand font-black text-gray-800 uppercase tracking-tighter">Cultura Hispana</h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-sm">Explora el mundo hispanohablante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.map(country => (
          <button 
            key={country.id} 
            onClick={() => setSelectedCountry(country)}
            className="bg-white rounded-[4rem] shadow-xl overflow-hidden group hover:translate-y-[-12px] transition-all duration-500 border border-gray-100 flex flex-col h-full"
          >
            <div className="h-48 bg-spanish-red relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-8 left-8 z-20">
                <h3 className="text-white font-brand font-black text-4xl uppercase tracking-tighter">{country.name}</h3>
              </div>
              <div className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                <Globe size={24} />
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-between space-y-6">
              <p className="text-gray-400 font-bold italic text-lg leading-relaxed line-clamp-3">
                {country.text}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[10px] font-black text-spanish-red uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} /> 10 Ejercicios
                </span>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-spanish-red group-hover:text-white transition-all">
                  <Play size={20} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
