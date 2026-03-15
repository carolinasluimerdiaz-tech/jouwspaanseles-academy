
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Heart, X, CheckCircle2, ChevronRight, Speaker, 
  Sparkles, Award, Zap, PlayCircle, Brain, 
  MessageSquare, Mic, UserCircle, Loader2,
  Star
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { GRAMMAR_DATA, VOCAB_DATA, NUMBER_DATA } from '../constants/gameData';
import { VIDEO_LESSONS } from '../constants';
import { ZayroBotIcon } from './ZayroBotIcon';

type StepType = 'INFO' | 'GRAMMAR' | 'VOCAB' | 'AI_CHAT' | 'RESULT';

interface Step {
  type: StepType;
  title: string;
  content: any;
}

export const DuolingoSession: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    const generatedSteps: Step[] = [
      { type: 'INFO', title: 'Lección Inicial', content: VIDEO_LESSONS[0] },
      { type: 'VOCAB', title: 'Palabras Clave', content: VOCAB_DATA.espanol_basico[0] },
      { type: 'GRAMMAR', title: 'Pilar: SER', content: GRAMMAR_DATA.ser[0] },
      { type: 'AI_CHAT', title: 'Reto Zayrolingua', content: { prompt: "Preséntate en español con Zayrolingua." } },
      { type: 'RESULT', title: '¡Misión Cumplida!', content: {} }
    ];
    setSteps(generatedSteps);
  }, []);

  const handleSpeak = async (text: string) => {
    try {
      const speechResult = await geminiService.generateSpeech(text);
      if (speechResult.audioData) {
        const audio = new Audio(`data:audio/pcm;base64,${speechResult.audioData}`);
        audio.play();
      }
    } catch (e) {}
  };

  const checkAnswer = (answer: string) => {
    if (feedback || isProcessing) return;
    const currentStep = steps[currentStepIndex];
    let isCorrect = answer === (currentStep.type === 'GRAMMAR' ? currentStep.content.answer : currentStep.content.en);

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 50);
      handleSpeak("¡Excelente!");
    } else {
      setFeedback('wrong');
      setHearts(h => Math.max(0, h - 1));
      handleSpeak("Intenta de nuevo.");
    }
  };

  const handleChatChallenge = async () => {
    if (!chatInput.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const chatSession = await geminiService.startChat("Challenge Checkpoint", ["Review", "Conversation"], 1); 
      const response = await chatSession.sendMessage({ message: chatInput });
      const responseText = response.text || "";
      setChatResponse(responseText);
      setScore(s => s + 100);
      setFeedback('correct');
    } catch (e) {
      setFeedback('wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-4xl mx-auto w-full p-6 flex items-center gap-6">
        <button onClick={onExit} className="text-gray-400 hover:text-spanish-red transition-colors"><X size={32} /></button>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-spanish-gold transition-all" style={{ width: `${progress}%` }}></div></div>
        <div className="flex items-center gap-2 text-spanish-red font-black text-xl"><Heart size={24} fill="currentColor" /><span>{hearts}</span></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center">
        <div className="max-w-2xl w-full space-y-12">
          {currentStep.type === 'AI_CHAT' && (
            <div className="space-y-10 animate-in fade-in flex flex-col items-center">
               <ZayroBotIcon size={120} className="mb-6" />
               <div className="bg-white p-8 rounded-[2rem] border-2 border-spanish-gold/30 shadow-xl relative text-center">
                  <p className="font-brand font-bold text-gray-700 text-xl italic">"{currentStep.content.prompt}"</p>
               </div>
               <div className="w-full space-y-6">
                  <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Escribe en español..." className="w-full bg-gray-50 rounded-[2rem] p-6 outline-none focus:ring-2 focus:ring-spanish-gold h-32 shadow-inner" />
                  <button onClick={handleChatChallenge} disabled={isProcessing} className="w-full bg-spanish-red text-white py-6 rounded-[2rem] font-brand font-black uppercase shadow-2xl flex items-center justify-center gap-4">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Mic size={24} /> Enviar Respuesta</>}
                  </button>
               </div>
            </div>
          )}

          {currentStep.type === 'GRAMMAR' && (
            <div className="space-y-10">
               <h3 className="text-2xl font-brand font-black text-gray-800 text-center uppercase">Completa la frase:</h3>
               <div className="bg-gray-50 p-10 rounded-[3rem] text-center"><p className="text-4xl font-brand font-black text-gray-800">{currentStep.content.question}</p></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentStep.content.options.map((opt: string) => (
                   <button key={opt} onClick={() => checkAnswer(opt)} className={`p-6 rounded-[2rem] font-brand font-black text-xl border-4 transition-all ${feedback ? (opt === currentStep.content.answer ? 'bg-green-500 text-white' : 'opacity-50') : 'bg-white hover:border-spanish-gold'}`}>{opt}</button>
                 ))}
               </div>
            </div>
          )}

          {currentStep.type === 'RESULT' && (
             <div className="text-center space-y-12 animate-in zoom-in-95">
                <Award size={150} className="text-spanish-gold mx-auto" />
                <h2 className="text-5xl font-brand font-black text-gray-800 uppercase">¡Misión Cumplida!</h2>
                <button onClick={onExit} className="bg-spanish-red text-white px-12 py-6 rounded-[2rem] font-brand font-black uppercase shadow-xl hover:scale-105 transition-all">Finalizar Sesión</button>
             </div>
          )}
        </div>
      </div>

      <div className={`p-8 border-t-8 transition-all ${feedback === 'correct' ? 'bg-green-100 border-green-500' : feedback === 'wrong' ? 'bg-red-100 border-red-500' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-brand font-black text-xl uppercase">{feedback === 'correct' ? '¡Excelente!' : feedback === 'wrong' ? '¡Vuelve a intentar!' : 'ZayroLingua Bot'}</div>
          {(feedback || currentStep.type === 'INFO') && (
            <button onClick={() => { setFeedback(null); currentStepIndex < steps.length - 1 ? setCurrentStepIndex(currentStepIndex + 1) : onExit(); }} className="bg-green-500 text-white px-10 py-5 rounded-[1.5rem] font-brand font-black uppercase">Siguiente</button>
          )}
        </div>
      </div>
    </div>
  );
};
