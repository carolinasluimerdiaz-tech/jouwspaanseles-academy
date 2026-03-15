
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Trophy, ArrowLeft, Brain, Globe, Heart, Headphones, 
  PencilLine, Volume2, Loader2, CheckCircle2, Play,
  AlertCircle, Sparkles, BookOpen, Mic, MicOff, Star
} from 'lucide-react';
import { 
  GRAMMAR_DATA, VOCAB_DATA, NUMBER_DATA, WRITING_DATA, COMMON_VERBS_100_DATA,
  JAPANESE_GRAMMAR_DATA, JAPANESE_VOCAB_DATA, JAPANESE_NUMBER_DATA, JAPANESE_WRITING_DATA
} from '../constants/gameData';
import { READING_STORIES } from '../constants/readingData';
import { AppSection, LanguageOption } from '../types'; 
import { geminiService } from '../services/geminiService';

type Zone = 'SELECTOR' | 'GAME_ACTIVE' | 'SUB_SELECTOR';
type GameMode = 'GRAMMAR' | 'VOCAB' | 'LISTENING' | 'WRITING' | 'NUMBERS' | 'PRONUNCIATION' | 'SENTENCE_ORDER';

interface GamesSectionProps {
  isFreeUser?: boolean;
  onNavigate: (section: AppSection) => void; 
  onExerciseComplete?: (action: string, xp: number) => void;
  selectedLanguage?: LanguageOption;
}

const CATEGORY_COLORS = [
  'bg-blue-500', 'bg-rose-500', 'bg-emerald-500', 
  'bg-amber-500', 'bg-indigo-500', 'bg-violet-500', 
  'bg-orange-500', 'bg-teal-500', 'bg-pink-500'
];

export const GamesSection: React.FC<GamesSectionProps> = ({ isFreeUser = false, onNavigate, onExerciseComplete, selectedLanguage }) => {
  const isJapanese = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH;
  const [activeZone, setActiveZone] = useState<Zone>('SELECTOR');
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [subCategory, setSubCategory] = useState<string>('');
  
  const [sessionPoints, setSessionPoints] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionDeck, setSessionDeck] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState<any>(null); 
  const [options, setOptions] = useState<string[]>([]); 
  const [selectedOption, setSelectedOption] = useState<string | null>(null); 

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [writingInput, setWritingInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readingFeedback, setReadingFeedback] = useState<{ score: number, mispronouncedWords: string[], feedback: string } | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null); 

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsAnalyzing(true);
          try {
            const result = await geminiService.analyzeReadingPronunciation(currentRound.text, base64Audio);
            setReadingFeedback(result);
            if (result.score >= 80) {
              setSessionPoints(p => p + result.score);
              speakText(isJapanese ? "よくできました！" : "¡Muy bien!", isJapanese ? 'ja-JP' : 'es-ES');
            } else {
              setSessionPoints(p => Math.max(0, p - (100 - result.score)));
              speakText(isJapanese ? "もう一度練習しましょう" : "Sigue practicando", isJapanese ? 'ja-JP' : 'es-ES');
            }
          } catch (e) {
            console.error("Error analyzing pronunciation:", e);
          } finally {
            setIsAnalyzing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setReadingFeedback(null);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Stop current audio playback
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

  // Text-to-speech logic using Gemini API
  const speakText = useCallback(async (text: string, lang: string = 'es-ES') => {
    if (!text || text.startsWith('http')) return;
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
      const speechResult = await geminiService.generateSpeech(text, lang);
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
      utterance.lang = lang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsAudioLoading(false);
    }
  }, [stopCurrentAudio]);

  const hasReportedCompletion = useRef(false);

  useEffect(() => {
    if (isGameOver && onExerciseComplete && sessionPoints > 0 && !hasReportedCompletion.current) {
      onExerciseComplete(`Completed ${activeMode} session: ${subCategory.replace(/_/g, ' ')}`, sessionPoints);
      hasReportedCompletion.current = true;
    }
    if (!isGameOver) {
      hasReportedCompletion.current = false;
    }
  }, [isGameOver, onExerciseComplete, sessionPoints, activeMode, subCategory]);

  // Data fetching helper
  const getSourceData = (mode: GameMode | null, cat: string) => {
    if (isJapanese) {
      if (mode === 'GRAMMAR') return (JAPANESE_GRAMMAR_DATA as any)[cat] || [];
      if (mode === 'VOCAB') return (JAPANESE_VOCAB_DATA as any)[cat] || [];
      if (mode === 'LISTENING') return (JAPANESE_VOCAB_DATA as any)[cat] || [];
      if (mode === 'WRITING') return (JAPANESE_WRITING_DATA as any)[cat] || (JAPANESE_VOCAB_DATA as any)[cat] || [];
      if (mode === 'NUMBERS') return JAPANESE_NUMBER_DATA.all;
      if (mode === 'PRONUNCIATION') return READING_STORIES;
      if (mode === 'SENTENCE_ORDER') return JAPANESE_GRAMMAR_DATA.orden_frases;
      return [];
    }
    if (mode === 'GRAMMAR') return (GRAMMAR_DATA as any)[cat] || [];
    if (mode === 'VOCAB') return (VOCAB_DATA as any)[cat] || [];
    if (mode === 'LISTENING') return (VOCAB_DATA as any)[cat] || [];
    if (mode === 'WRITING') return (WRITING_DATA as any)[cat] || (VOCAB_DATA as any)[cat] || [];
    if (mode === 'NUMBERS') return NUMBER_DATA.all;
    if (mode === 'PRONUNCIATION') return READING_STORIES;
    if (mode === 'SENTENCE_ORDER') return []; // No sentence order data for other languages yet
    return [];
  };

  // Round loader logic
  const loadRound = (round: any, mode: GameMode, fullData: any[]) => {
    if (!round) return;
    setCurrentRound(round);
    setFeedback(null);
    setSelectedOption(null);
    setWritingInput('');
    
    if (mode === 'GRAMMAR') {
        setOptions(round.options || []);
    } else if (mode === 'VOCAB') {
        const correct = isJapanese ? round.jp : round.en;
        const wrongs = fullData
            .filter(d => (isJapanese ? d.jp : d.en) !== correct)
            .map(d => (isJapanese ? d.jp : d.en))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setOptions([correct, ...wrongs].sort(() => Math.random() - 0.5));
        
        if (isJapanese) {
          if (round.jp && !round.jp.startsWith('http')) {
            setTimeout(() => speakText(round.jp, 'ja-JP'), 300);
          }
        } else {
          if (round.es && !round.es.startsWith('http')) {
            setTimeout(() => speakText(round.es), 300);
          }
        }
    } else if (mode === 'NUMBERS') {
        const correct = isJapanese ? round.jp : round.es;
        const wrongs = fullData
            .filter(d => (isJapanese ? d.jp : d.es) !== correct)
            .map(d => (isJapanese ? d.jp : d.es))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setOptions([correct, ...wrongs].sort(() => Math.random() - 0.5));
    } else if (mode === 'WRITING') {
        if (isJapanese) {
          if (round.jp) setTimeout(() => speakText(round.jp, 'ja-JP'), 500);
        } else {
          if (round.es) setTimeout(() => speakText(round.es), 500);
        }
    } else if (mode === 'PRONUNCIATION') {
        setReadingFeedback(null);
    } else if (mode === 'SENTENCE_ORDER') {
        setOrderedWords([]);
        setAvailableWords([...(round.options || [])].sort(() => Math.random() - 0.5));
    }
  };

  // Session initializer
  const prepareSession = (mode: GameMode, cat: string) => {
    const rawData = getSourceData(mode, cat);
    const data = mode === 'PRONUNCIATION' ? rawData : rawData.filter((i: any) => 
      mode === 'GRAMMAR' ? !!i.question : 
      mode === 'WRITING' ? !!(isJapanese ? i.jp : i.es) && !(isJapanese ? i.jp : i.es).startsWith('http') : 
      !!((isJapanese ? i.jp : i.es) || i.img)
    );

    if (data.length === 0) return;

    const deck = mode === 'LISTENING' || mode === 'PRONUNCIATION' ? data : [...data].sort(() => Math.random() - 0.5).slice(0, 15);
    
    setExerciseCount(0);
    setSessionPoints(0);
    setHearts(5);
    setIsGameOver(false);
    setActiveZone('GAME_ACTIVE');
    setActiveMode(mode);
    setSubCategory(cat);
    setSessionDeck(deck);
    loadRound(deck[0], mode, data);
  };

  // Answer handling logic
  const handleAnswer = (ans: string) => {
    if (feedback || isGameOver) return;
    setSelectedOption(ans);
    
    let correctVal = '';
    if (activeMode === 'VOCAB') correctVal = isJapanese ? currentRound.jp : currentRound.en;
    else if (activeMode === 'NUMBERS') correctVal = isJapanese ? currentRound.jp : currentRound.es;
    else if (activeMode === 'GRAMMAR' || activeMode === 'SENTENCE_ORDER') correctVal = currentRound.answer;
    else correctVal = (isJapanese ? (currentRound.jp || currentRound.answer) : (currentRound.es || currentRound.answer));

    const isCorrect = (ans || '').toLowerCase().trim() === (correctVal || '').toLowerCase().trim();

    if (isCorrect) {
      setFeedback('correct');
      setSessionPoints(p => p + 50);
      speakText(isJapanese ? "素晴らしい！" : "¡Excelente!", isJapanese ? 'ja-JP' : 'es-ES');
      setTimeout(() => {
        const next = exerciseCount + 1;
        if (next >= sessionDeck.length) setIsGameOver(true);
        else { 
          setExerciseCount(next); 
          loadRound(sessionDeck[next], activeMode!, getSourceData(activeMode, subCategory)); 
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      setSessionPoints(p => Math.max(0, p - 10));
      setHearts(h => Math.max(0, h - 1));
      speakText(isJapanese ? "もう一度やってみて" : "Inténtalo de nuevo", isJapanese ? 'ja-JP' : 'es-ES');
      if (hearts <= 1) setTimeout(() => setIsGameOver(true), 1500);
      else setTimeout(() => { setFeedback(null); setSelectedOption(null); }, 1500);
    }
  };

  const handleWordClick = (word: string, index: number) => {
    if (feedback) return;
    const newOrdered = [...orderedWords, word];
    setOrderedWords(newOrdered);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (feedback) return;
    setOrderedWords(orderedWords.filter((_, i) => i !== index));
    setAvailableWords([...availableWords, word]);
  };

  const checkSentenceOrder = () => {
    const currentSentence = orderedWords.join(' ');
    handleAnswer(currentSentence);
  };

  const handleFinishListening = () => {
    setSessionPoints(sessionDeck.length * 10); // 10 points per word in the list
    setIsGameOver(true);
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-500">
      {activeZone === 'SELECTOR' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            { id: 'GRAMMAR', title: 'Grammar', icon: <Brain size={42} />, color: 'border-spanish-gold', text: 'text-spanish-gold' },
            { id: 'VOCAB', title: 'Vocabulary', icon: <Globe size={42} />, color: 'border-spanish-red', text: 'text-spanish-red' },
            { id: 'LISTENING', title: 'Listening', icon: <Headphones size={42} />, color: 'border-blue-500', text: 'text-blue-500' },
            { id: 'WRITING', title: 'Writing', icon: <PencilLine size={42} />, color: 'border-purple-500', text: 'text-purple-500' },
            { id: 'NUMBERS', title: 'Numbers', icon: <div className="font-brand font-black text-4xl">123</div>, color: 'border-orange-500', text: 'text-orange-500' },
            ...(isJapanese ? [{ id: 'SENTENCE_ORDER', title: 'Sentence Order', icon: <Sparkles size={42} />, color: 'border-amber-500', text: 'text-amber-500' }] : []),
            { id: 'PRONUNCIATION', title: 'Pronunciation Practice', icon: <Mic size={42} />, color: 'border-emerald-500', text: 'text-emerald-500' },
          ].map(m => (
            <button key={m.id} onClick={() => { 
              if (m.id === 'PRONUNCIATION') {
                prepareSession('PRONUNCIATION', 'all');
              } else if (m.id === 'NUMBERS') {
                prepareSession('NUMBERS', 'all');
              } else if (m.id === 'SENTENCE_ORDER') {
                prepareSession('SENTENCE_ORDER', 'all');
              } else {
                setActiveMode(m.id as GameMode); 
                setActiveZone('SUB_SELECTOR'); 
              }
            }} className={`bg-white p-10 rounded-[3rem] shadow-xl border-b-[10px] ${m.color} transition-all hover:scale-105 active:scale-95 group`}>
              <div className={`${m.text} mx-auto mb-6 w-fit group-hover:scale-110 transition-transform`}>{m.icon}</div>
              <h4 className="font-brand font-black text-lg uppercase text-gray-800 text-center">{m.title}</h4>
            </button>
          ))}
        </div>
      )}

      {activeZone === 'SUB_SELECTOR' && (
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl space-y-10 border-t-8 border-spanish-gold">
           <button onClick={() => setActiveZone('SELECTOR')} className="text-spanish-red font-black uppercase text-xs flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-full transition-all w-fit"><ArrowLeft size={16}/> Back to Menu</button>
           <h3 className="text-3xl font-brand font-black text-gray-800 uppercase tracking-tight">Select a Topic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.keys(
                isJapanese ? (
                  activeMode === 'GRAMMAR' ? JAPANESE_GRAMMAR_DATA : 
                  activeMode === 'VOCAB' || activeMode === 'LISTENING' ? JAPANESE_VOCAB_DATA : 
                  JAPANESE_WRITING_DATA
                ) : (
                  activeMode === 'GRAMMAR' ? GRAMMAR_DATA : 
                  activeMode === 'VOCAB' || activeMode === 'LISTENING' ? VOCAB_DATA : 
                  WRITING_DATA
                )
              ).map((k, idx) => (
                <button key={k} onClick={() => prepareSession(activeMode!, k)} className={`${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} text-white p-8 rounded-[2rem] font-brand font-black uppercase text-sm shadow-lg hover:brightness-110 hover:translate-y-[-4px] transition-all`}>
                  {k.replace(/_/g, ' ')}
                </button>
              ))}
           </div>
        </div>
      )}

      {activeZone === 'GAME_ACTIVE' && !isGameOver && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95">
           <div className="flex items-center justify-between">
              <button onClick={() => setActiveZone('SUB_SELECTOR')} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red flex items-center gap-2"><ArrowLeft size={14}/> Quit Game</button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
                    <Star size={20} fill="#F1BF00" className="text-spanish-gold" />
                    <span className="font-brand font-black text-lg text-gray-800">{Math.floor(sessionPoints)}</span>
                </div>

                {activeMode !== 'LISTENING' && (
                  <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
                      <Heart size={20} fill="#AA151B" className={`${hearts < 2 ? 'animate-pulse' : ''} text-spanish-red`} />
                      <span className="font-brand font-black text-lg text-spanish-red">{hearts}</span>
                  </div>
                )}
              </div>
           </div>

           {activeMode === 'LISTENING' ? (
              <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-3xl border-t-[20px] border-blue-500">
                <div className="text-center mb-12">
                   <h2 className="text-4xl font-brand font-black text-gray-800 uppercase">Word List</h2>
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Click to hear the pronunciation</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                   {sessionDeck.map((item, idx) => (
                     <div key={idx} className="bg-gray-50 p-6 rounded-3xl flex items-center justify-between group hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                        <div className="flex items-center gap-4">
                           <button 
                             onClick={() => speakText(isJapanese ? item.jp : item.es, isJapanese ? 'ja-JP' : 'es-ES')}
                             className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                           >
                             <Volume2 size={24} />
                           </button>
                           <div>
                             <p className="font-brand font-black text-xl text-gray-800 uppercase">{isJapanese ? item.jp : item.es}</p>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isJapanese ? item.es : item.en}</p>
                           </div>
                        </div>
                        {item.img && <img src={item.img} className="w-12 h-12 rounded-xl object-cover" alt="" />}
                     </div>
                   ))}
                </div>
                <div className="mt-10 flex justify-center">
                   <button 
                     onClick={handleFinishListening}
                     className="bg-blue-600 text-white px-16 py-6 rounded-[2rem] font-brand font-black uppercase shadow-2xl hover:scale-110 active:scale-95 transition-all text-sm tracking-widest"
                   >
                     Finish Session
                   </button>
                </div>
              </div>
            ) : activeMode === 'PRONUNCIATION' ? (
              <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-3xl border-t-[20px] border-emerald-500 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-brand font-black text-gray-800 uppercase">Pronunciation Practice</h2>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => speakText(currentRound.text, isJapanese ? 'ja-JP' : 'es-ES')}
                      className={`w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
                    >
                      <Volume2 size={28} />
                    </button>
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isAnalyzing}
                      className={`w-14 h-14 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50`}
                    >
                      {isAnalyzing ? <Loader2 size={28} className="animate-spin" /> : (isRecording ? <MicOff size={28} /> : <Mic size={28} />)}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100 relative">
                  <h3 className="text-xl font-brand font-black text-emerald-600 uppercase mb-2">{currentRound.title}</h3>
                  <div className="text-2xl font-brand font-black text-gray-800 leading-relaxed">
                    {currentRound.text.split('\n\n').map((paragraph: string, pIdx: number) => (
                      <p key={pIdx} className="mb-6 last:mb-0">
                        {paragraph.split(/\s+/).map((word: string, wIdx: number) => {
                          const cleanWord = (word || '').replace(/[.,!?;:]/g, '').toLowerCase();
                          const isWrong = readingFeedback?.mispronouncedWords.some(w => (w || '').replace(/[.,!?;:]/g, '').toLowerCase() === cleanWord);
                          return (
                            <span key={wIdx} className={`${isWrong ? 'text-red-500 underline decoration-wavy' : ''} mr-2 inline-block`}>
                              {word}
                            </span>
                          );
                        })}
                      </p>
                    ))}
                  </div>
                </div>

                {readingFeedback && (
                  <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-brand font-black text-emerald-700 uppercase">Puntuación: {readingFeedback.score}%</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Sparkles key={star} size={16} className={star <= (readingFeedback.score / 20) ? 'text-emerald-500' : 'text-emerald-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-emerald-800 font-bold italic">"{readingFeedback.feedback}"</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Historia {exerciseCount + 1} de {sessionDeck.length}</p>
                  <button 
                    onClick={() => {
                      const next = exerciseCount + 1;
                      if (next >= sessionDeck.length) setIsGameOver(true);
                      else {
                        setExerciseCount(next);
                        loadRound(sessionDeck[next], 'PRONUNCIATION', sessionDeck);
                      }
                    }}
                    className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-brand font-black uppercase shadow-xl hover:bg-emerald-700 transition-all"
                  >
                    Siguiente Historia
                  </button>
                </div>
              </div>
            ) : activeMode === 'WRITING' ? (
              <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-3xl text-center border-t-[20px] border-purple-500">
                 <h2 className="text-2xl font-brand font-black text-gray-400 uppercase tracking-widest mb-10">Listen and Write</h2>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ejercicio {exerciseCount + 1} de {sessionDeck.length}</p>
                 <button 
                   onClick={() => speakText(isJapanese ? currentRound.jp : currentRound.es, isJapanese ? 'ja-JP' : 'es-ES')}
                   className={`w-32 h-32 bg-purple-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl transition-all hover:scale-110 active:scale-95 ${isSpeaking ? 'animate-pulse' : ''}`}
                 >
                   <Volume2 size={56} />
                 </button>
                 <div className="max-w-md mx-auto space-y-6">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Meaning: <span className="text-gray-800">{isJapanese ? currentRound.es : currentRound.en}</span></p>
                    <input 
                      type="text" autoFocus value={writingInput} 
                      onChange={(e) => setWritingInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAnswer(writingInput)}
                      className="w-full p-6 rounded-2xl bg-gray-50 border-4 border-transparent focus:border-purple-500 outline-none text-2xl font-brand font-black uppercase text-center transition-all"
                      placeholder={isJapanese ? "Type in Japanese..." : "Type in Spanish..."}
                    />
                    <button 
                      onClick={() => handleAnswer(writingInput)}
                      className="w-full py-6 rounded-2xl bg-purple-600 text-white font-brand font-black uppercase tracking-widest shadow-xl hover:bg-purple-700 transition-all"
                    >
                      Check Answer
                    </button>
                 </div>
              </div>
            ) : activeMode === 'SENTENCE_ORDER' ? (
              <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-3xl text-center border-t-[20px] border-amber-500 space-y-10">
                 <h2 className="text-2xl font-brand font-black text-gray-400 uppercase tracking-widest">Order the Sentence</h2>
                 <div className="bg-amber-50 p-8 rounded-[2rem] border-2 border-amber-100">
                    <p className="text-3xl font-brand font-black text-gray-800 uppercase">{currentRound.question}</p>
                 </div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ejercicio {exerciseCount + 1} de {sessionDeck.length}</p>

                 {/* Built Sentence */}
                 <div className="min-h-[100px] p-6 rounded-3xl bg-gray-50 border-4 border-dashed border-gray-200 flex flex-wrap justify-center gap-3">
                    {orderedWords.map((word, idx) => (
                      <button 
                        key={`${word}-${idx}`}
                        onClick={() => handleRemoveWord(word, idx)}
                        className={`px-6 py-4 rounded-2xl font-brand font-black text-xl shadow-md transition-all hover:scale-105 active:scale-95 ${
                          feedback === 'correct' ? 'bg-green-500 text-white' : 
                          feedback === 'wrong' ? 'bg-red-500 text-white' : 
                          'bg-white text-gray-800 border-2 border-amber-200'
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                 </div>

                 {/* Word Bank */}
                 <div className="flex flex-wrap justify-center gap-3 pt-6">
                    {availableWords.map((word, idx) => (
                      <button 
                        key={`${word}-${idx}`}
                        onClick={() => handleWordClick(word, idx)}
                        disabled={!!feedback}
                        className="px-6 py-4 rounded-2xl bg-white border-2 border-gray-100 font-brand font-black text-xl text-gray-600 shadow-sm hover:border-amber-500 hover:text-amber-600 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {word}
                      </button>
                    ))}
                 </div>

                 <div className="pt-10">
                    <button 
                      onClick={checkSentenceOrder}
                      disabled={orderedWords.length === 0 || !!feedback}
                      className="bg-amber-600 text-white px-16 py-6 rounded-[2rem] font-brand font-black uppercase shadow-2xl hover:scale-110 active:scale-95 transition-all text-sm tracking-widest disabled:opacity-50"
                    >
                      Check Order
                    </button>
                 </div>
              </div>
            ) : (
              <div className={`bg-white p-12 md:p-20 rounded-[4rem] shadow-3xl text-center border-t-[20px] ${activeMode === 'GRAMMAR' ? 'border-spanish-gold' : 'border-spanish-red'}`}>
                 {currentRound.img && <img src={currentRound.img} className="w-64 h-64 mx-auto rounded-[2rem] shadow-xl mb-10 object-cover border-4 border-white" alt="Quiz" />}
                 <h2 className="text-4xl md:text-5xl font-brand font-black text-gray-800 mb-12 uppercase leading-tight drop-shadow-sm">
                   {activeMode === 'NUMBERS' ? currentRound.val : (currentRound.question || (isJapanese ? currentRound.jp : currentRound.es))}
                 </h2>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Ejercicio {exerciseCount + 1} de {sessionDeck.length}</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {options.map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => handleAnswer(opt)} 
                          className={`p-8 rounded-[2rem] border-4 font-brand font-black text-xl transition-all shadow-sm ${
                            feedback 
                              ? ((opt || '').toLowerCase().trim() === (currentRound.answer || (isJapanese ? currentRound.jp : currentRound.en) || '').toLowerCase().trim() 
                                  ? 'bg-green-500 text-white border-green-600 scale-105 shadow-xl' 
                                  : (selectedOption === opt ? 'bg-red-500 text-white border-red-600 opacity-60' : 'bg-white text-gray-300 border-gray-100 opacity-30')) 
                              : 'bg-white text-gray-800 border-gray-100 hover:border-spanish-gold hover:shadow-md active:scale-95'
                          }`}
                        >
                          {opt}
                        </button>
                    ))}
                 </div>
                 {activeMode === 'VOCAB' && (
                    <button onClick={() => speakText(isJapanese ? currentRound.jp : currentRound.es, isJapanese ? 'ja-JP' : 'es-ES')} className="mt-12 text-spanish-red font-black uppercase text-xs flex items-center gap-2 mx-auto bg-red-50 px-6 py-3 rounded-full hover:bg-red-100 transition-all">
                      <Volume2 size={16}/> Listen Again
                    </button>
                 )}
              </div>
           )}
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
           <div className="relative mb-12">
              <Trophy size={160} className="text-spanish-gold animate-bounce" />
              {/* Fix: Sparkles is now imported and will no longer cause a reference error */}
              <Sparkles size={48} className="absolute -top-4 -right-4 text-spanish-red animate-pulse" />
           </div>
           <h2 className="text-6xl font-brand font-black text-gray-800 uppercase mb-4 tracking-tighter">Session Over!</h2>
           <p className="text-gray-400 font-bold uppercase tracking-[0.4em] mb-12 text-xl">{sessionPoints} XP Points Earned</p>
           <div className="flex gap-4">
              <button 
                onClick={() => { setActiveZone('SELECTOR'); setIsGameOver(false); }} 
                className="bg-gray-100 text-gray-800 px-12 py-6 rounded-[2.5rem] font-brand font-black uppercase shadow-xl hover:bg-gray-200 transition-all text-sm tracking-widest"
              >
                Play Again
              </button>
              <button 
                onClick={() => onNavigate(AppSection.HOME)} 
                className="bg-spanish-red text-white px-16 py-6 rounded-[2.5rem] font-brand font-black uppercase shadow-2xl hover:scale-110 active:scale-95 transition-all text-sm tracking-widest"
              >
                Return to Dashboard
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
