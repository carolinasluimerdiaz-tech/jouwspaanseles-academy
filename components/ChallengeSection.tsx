
import React, { useState } from 'react';
import { Award, Target, Star, CheckCircle2, Calendar, MessageCircle, MapPin, Search, ArrowLeft } from 'lucide-react';
import { AppSection, LanguageOption } from '../types'; 

interface ChallengeSectionProps {
  onNavigate: (section: AppSection) => void;
  selectedLanguage?: LanguageOption;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ onNavigate, selectedLanguage }) => {
  const isJapanese = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH;
  const [completed, setCompleted] = useState<number[]>([]);

  const studyPath = isJapanese ? [
    { 
      id: 1, 
      title: 'Modulo 1', 
      tasks: [
        'Semana 1: Aprende los saludos básicos en japonés (Konnichiwa, Arigatou).',
        'Semana 2: Aprende los números del 1 al 10 en japonés.',
        'Semana 3: Desafío 1: Crea un audio presentándote en japonés (hablado): Di tu nombre, de dónde eres y cuántos años tienes.',
        'Semana 4: Repetición espaciada. Revisa las palabras difíciles.'
      ], 
      reward: 'Insignia de Confianza', 
      icon: <Target /> 
    },
    { 
      id: 2, 
      title: 'Modulo 2', 
      tasks: [
        'Semana 1: Aprende vocabulario de la familia en japonés.',
        'Semana 2: Aprende vocabulario de la ciudad en japonés.',
        'Semana 3: Desafío 2: Describe tu ciudad o pueblo en japonés (hablado). ¿Qué hay en tu ciudad? ¿Te gusta?',
        'Semana 4: Repetición espaciada. Revisa las palabras difíciles.'
      ], 
      reward: 'Insignia de Estructura', 
      icon: <Star /> 
    },
    { 
      id: 3, 
      title: 'Modulo 3', 
      tasks: [
        'Semana 1: Aprende verbos básicos en japonés.',
        'Semana 2: Aprende las partículas básicas (wa, ni, o).',
        'Semana 3: Desafío 3: Habla sobre tus actividades diarias en japonés.',
        'Semana 4: Repetición espaciada. Revisa las palabras difíciles.'
      ], 
      reward: 'Insignia de Explorador', 
      icon: <MapPin /> 
    },
    { 
      id: 4, 
      title: 'Modulo 4', 
      tasks: [
        'Semana 1: Aprende a decir la hora en japonés.',
        'Semana 2: Aprende vocabulario de alimentos en japonés.',
        'Semana 3: Desafío 4: Pide comida en un restaurante imaginario en japonés.',
        'Semana 4: Repetición espaciada. Revisa las palabras difíciles.'
      ], 
      reward: 'Insignia de Maestro del Tiempo', 
      icon: <Search /> 
    },
    { 
      id: 5, 
      title: 'Modulo 5', 
      tasks: [
        'Semana 1: Repaso general de gramática japonesa.',
        'Semana 2: Práctica de conversación fluida.',
        'Semana 3: Desafío 5: Conversación final con Carolina AI en japonés.',
        'Semana 4: Repetición espaciada. Revisa las palabras difíciles.'
      ], 
      reward: 'Insignia de Graduación', 
      icon: <Award /> 
    }
  ] : [
    { 
      id: 1, 
      title: 'Module 1', 
      tasks: [
        'Week 1: Watch Videos 1 to 5',
        'Week 2: Watch Videos 6 to 10',
        'Week 3: Challenge 1: crear un adudio en Whatsapp o en el teléfono: presentate en español: Give answer in Spanish: What\'s your name? Where are you from? How old are you? Where do you live? What is your phone number?',
        'Week 4: Spaced Repetition. Review difficult words.'
      ], 
      reward: 'Confidence Badge', 
      icon: <Target /> 
    },
    { 
      id: 2, 
      title: 'Module 2', 
      tasks: [
        'Week 1: Watch Videos 1 to 5',
        'Week 2: Watch Videos 6 to 10',
        'Week 3: Challenge 2: Describe tu ciuad o tu pueblo donde vives, ¿Qué hay en tu ciudad? ¿Qué hay en tu pueblo? Ejemplo: yo vivo en un pueblo, mi pueblo está en Holanda. Es un pueblo pequeño. Es muy bonito. En mi pueblo hay un supermercado, un colegio, una piscina, y mucha naturaleza. En mi pueblo no hay universidades, no hay edificios moderdnos y no hay oficina de correos. Me gusta mucho mi pueblo.',
        'Week 4: Spaced Repetition. Review difficult words.'
      ], 
      reward: 'Structure Badge', 
      icon: <Star /> 
    },
    { 
      id: 3, 
      title: 'Module 3', 
      tasks: [
        'Week 1: Watch Videos 1 to 5',
        'Week 2: Watch Videos 6 to 10',
        'Week 3: Challenge 3',
        'Week 4: Spaced Repetition. Review difficult words.'
      ], 
      reward: 'Explorer Badge', 
      icon: <MapPin /> 
    },
    { 
      id: 4, 
      title: 'Module 4', 
      tasks: [
        'Week 1: Watch Videos 1 to 5',
        'Week 2: Watch Videos 6 to 10',
        'Week 3: Challenge 4',
        'Week 4: Spaced Repetition. Review difficult words.'
      ], 
      reward: 'Time Master Badge', 
      icon: <Search /> 
    },
    { 
      id: 5, 
      title: 'Module 5', 
      tasks: [
        'Week 1: Watch Videos 1 to 5',
        'Week 2: Watch Videos 6 to 10',
        'Week 3: Challenge 5',
        'Week 4: Spaced Repetition. Review difficult words.'
      ], 
      reward: 'Graduation Badge', 
      icon: <Award /> 
    }
  ];

  const handleComplete = (id: number) => {
    if (completed.includes(id)) return;
    setCompleted([...completed, id]);
  };

  const progress = (completed.length / studyPath.length) * 100;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Back to Dashboard Button */}
      <button 
        onClick={() => onNavigate(AppSection.HOME)} 
        className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red mb-8"
        aria-label="Volver al Dashboard"
      >
        <ArrowLeft size={16}/> Volver al Dashboard
      </button>

      <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-spanish-red/10 text-spanish-red rounded-3xl flex items-center justify-center">
               <Calendar size={40} />
            </div>
            <div>
               <h3 className="font-brand font-black text-3xl text-gray-800 tracking-tight uppercase leading-none">Success <br/><span className="text-spanish-red">Roadmap</span></h3>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">The 5-Month Beginner Plan</p>
            </div>
         </div>
         <div className="w-full md:w-80">
            <div className="flex justify-between text-[11px] font-black uppercase text-spanish-red mb-3 tracking-widest">
               <span>Roadmap Progress</span>
               <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-5 bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
               <div 
                 className={`h-full bg-gradient-to-r ${isJapanese ? 'from-emerald-500 to-blue-500' : 'from-spanish-red to-spanish-gold'} rounded-full transition-all duration-1000`} 
                 style={{ width: `${progress}%` }}
               ></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className={`bg-white p-12 rounded-[4rem] shadow-2xl border-t-[16px] ${isJapanese ? 'border-emerald-500' : 'border-spanish-red'} relative overflow-hidden`}>
             <div className="space-y-10">
                {studyPath.map((m) => (
                  <div key={m.id} className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col gap-8 ${completed.includes(m.id) ? 'bg-green-50 border-green-200 opacity-80' : 'bg-gray-50 border-gray-100 hover:border-spanish-gold shadow-md'}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${completed.includes(m.id) ? 'bg-green-500 text-white' : `bg-white ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'}`}`}>
                            {completed.includes(m.id) ? <CheckCircle2 size={32} /> : m.icon}
                         </div>
                         <div>
                            <h4 className={`font-brand font-black text-2xl tracking-tight leading-tight ${completed.includes(m.id) ? 'text-green-700' : 'text-gray-800'}`}>{m.title}</h4>
                            <span className={`font-brand font-black ${isJapanese ? 'text-blue-500' : 'text-spanish-gold'} text-xs uppercase tracking-widest`}>{m.reward}</span>
                         </div>
                      </div>
                      {!completed.includes(m.id) ? (
                         <button onClick={() => handleComplete(m.id)} className={`bg-white ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} px-8 py-4 rounded-2xl font-brand font-black text-xs uppercase tracking-widest shadow-md ${isJapanese ? 'hover:bg-emerald-500' : 'hover:bg-spanish-red'} hover:text-white transition-all border border-gray-200`}>
                            Check as Finished
                         </button>
                       ) : (
                         <span className="text-green-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={18} /> Module Cleared
                         </span>
                       )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t border-gray-200/50 pt-8">
                       {m.tasks.map((task, idx) => (
                         <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className={`mt-1.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center border-2 ${completed.includes(m.id) ? 'bg-green-500 border-green-500 text-white' : (isJapanese ? 'border-emerald-500 text-emerald-500' : 'border-spanish-red text-spanish-red')}`}>
                               {completed.includes(m.id) && <CheckCircle2 size={12} />}
                            </div>
                            <p className={`text-sm font-medium leading-relaxed ${completed.includes(m.id) ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                               {task}
                            </p>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className={`bg-gradient-to-br ${isJapanese ? 'from-emerald-500 to-blue-500' : 'from-spanish-red to-spanish-gold'} p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group`}>
              <Star size={64} className="mb-8 animate-pulse text-white/40" />
              <h3 className="font-brand font-black text-4xl tracking-tighter mb-2 uppercase">Roadmap</h3>
              <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-80 mb-10">Monthly Success Plan</p>
           </div>

           <div className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-xl text-center">
              <MessageCircle className={`mx-auto ${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} mb-6`} size={48} />
              <h4 className="font-brand font-black text-2xl text-gray-800 uppercase tracking-tight mb-2">Weekly Goal</h4>
              <p className={`${isJapanese ? 'text-emerald-500' : 'text-spanish-red'} font-black text-sm uppercase tracking-widest mb-8`}>Instructions</p>
              <div className="space-y-6 text-left">
                 <div className={`p-4 ${isJapanese ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-spanish-red'} rounded-2xl border-l-4 italic text-xs text-gray-600`}>
                   "Stick to the weekly video counts to ensure steady progress without burnout."
                 </div>
                 <div className={`p-4 ${isJapanese ? 'bg-blue-50 border-blue-500' : 'bg-yellow-50 border-spanish-gold'} rounded-2xl border-l-4 italic text-xs text-gray-600`}>
                   "Carolina AI session should last at least 15 minutes to be effective."
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};