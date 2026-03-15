
import React, { useState } from 'react';
import { VIDEO_LESSONS, MODULES } from '../constants';
import { PlayCircle, CheckCircle, GraduationCap, Sparkles, ArrowLeft, Home, Info } from 'lucide-react'; 
import { VideoLesson, AppSection, LanguageOption } from '../types'; // Import AppSection

interface VideoSectionProps {
  onNavigate: (section: AppSection) => void;
  selectedLanguage?: LanguageOption;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onNavigate, selectedLanguage }) => {
  const [completed, setCompleted] = useState<string[]>([]);
  
  const isSpanishForEnglish = selectedLanguage === LanguageOption.SPANISH_FOR_ENGLISH;
  const isJapanese = selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH;
  const isEmptyClasses = selectedLanguage === LanguageOption.SPANISH_FOR_DUTCH || selectedLanguage === LanguageOption.ENGLISH_FOR_SPANISH;

  if (isJapanese) {
    return null; // Should not be reachable if nav is hidden
  }

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-full mx-auto pb-32">
      {/* Back to Dashboard Button */}
      <button 
        onClick={() => onNavigate(AppSection.HOME)} 
        className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red mb-8"
        aria-label="Volver al Dashboard"
      >
        <ArrowLeft size={16}/> Volver al Dashboard
      </button>

      {/* Academy Progress Header */}
      <div className="bg-white p-8 rounded-[3rem] border-4 border-spanish-gold/20 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-spanish-red text-white rounded-2xl flex items-center justify-center shadow-lg">
               <GraduationCap size={32} />
            </div>
            <div>
               <h3 className="font-brand font-black text-2xl text-gray-800 tracking-tight uppercase">Masterclasses</h3>
               <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                 {isEmptyClasses ? 'Coming Soon' : `${completed.length} of ${VIDEO_LESSONS.length} classes completed`}
               </p>
            </div>
         </div>
      </div>

      {isEmptyClasses ? (
        <div className="bg-white p-20 rounded-[4rem] shadow-xl border-2 border-dashed border-gray-200 text-center space-y-6">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-3xl font-brand font-black text-gray-800 uppercase tracking-tighter">Classes Coming Soon</h2>
          <p className="text-gray-400 font-bold italic text-lg max-w-lg mx-auto">
            We are currently preparing the video lessons for this language track. Stay tuned for updates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {MODULES.map((mod) => {
            const moduleVideos = VIDEO_LESSONS.filter(v => v.module === mod.id);
            const moduleCompleted = completed.filter(id => moduleVideos.find(v => v.id === id)).length;
            
            return (
              <div key={mod.id} className="bg-white rounded-[4rem] shadow-xl border-l-[20px] border-spanish-red overflow-hidden">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <div className="bg-spanish-gold text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-4">Module {mod.id}</div>
                    <h2 className="font-brand font-black text-3xl text-gray-800 uppercase tracking-tighter leading-tight">{mod.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-brand font-black text-spanish-red">{moduleCompleted}/{moduleVideos.length}</div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lessons</p>
                  </div>
                </div>

                <div className="p-10 grid grid-cols-2 md:grid-cols-5 gap-6 bg-[#fdfcf6]/30">
                  {moduleVideos.map((video) => (
                    <div 
                      key={video.id}
                      onClick={() => { 
                        window.open(video.url, '_blank'); 
                      }}
                      className={`group relative p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${completed.includes(video.id) ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 hover:border-spanish-gold hover:shadow-xl'}`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${completed.includes(video.id) ? 'bg-green-500' : 'bg-spanish-red'}`}>
                        {completed.includes(video.id) ? <CheckCircle size={28} /> : <PlayCircle size={28} />}
                      </div>
                      <h4 className={`text-[11px] font-black uppercase leading-tight ${completed.includes(video.id) ? 'text-green-700' : 'text-gray-800'}`}>
                        {video.title}
                      </h4>
                      {video.instructions && ( 
                        <p className="text-[9px] text-gray-500 font-bold italic mt-2 leading-tight">
                          {video.instructions}
                        </p>
                      )}
                      <button 
                        onClick={(e) => toggleComplete(video.id, e)}
                        className={`absolute -bottom-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 shadow-lg border-2 border-white ${completed.includes(video.id) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-spanish-gold hover:text-white'}`}
                        aria-label={completed.includes(video.id) ? 'Marcar como incompleta' : 'Marcar como completa'}
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};