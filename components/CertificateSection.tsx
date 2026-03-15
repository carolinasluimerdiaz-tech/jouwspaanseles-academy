
import React, { useRef } from 'react';
import { Award, Download, Share2, Star, ShieldCheck, Printer } from 'lucide-react';
import { AppSection } from '../types';

// Define props interface to include onNavigate which is passed from App.tsx
interface CertificateSectionProps {
  studentName: string;
  onNavigate: (section: AppSection) => void;
}

// Add onNavigate to the component props and use the defined interface
export const CertificateSection: React.FC<CertificateSectionProps> = ({ studentName, onNavigate }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-4xl mx-auto bg-white p-2 rounded-[3rem] shadow-2xl border-4 border-spanish-gold/30">
        <div ref={certRef} className="relative bg-white p-16 md:p-24 rounded-[2.8rem] border-[12px] border-spanish-red flex flex-col items-center text-center overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-[16px] border-l-[16px] border-spanish-gold"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-[16px] border-r-[16px] border-spanish-gold"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[16px] border-l-[16px] border-spanish-gold"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[16px] border-r-[16px] border-spanish-gold"></div>
          
          <div className="mb-12">
            <div className="w-24 h-24 bg-spanish-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-spanish-gold">
               <Award size={48} className="text-white" />
            </div>
            <h1 className="font-brand font-black text-spanish-red text-5xl md:text-6xl tracking-tighter uppercase">ZayroLingua Academy</h1>
            <p className="text-spanish-gold font-bold uppercase tracking-[0.4em] text-xs mt-2">Elite Language Excellence</p>
          </div>

          <div className="space-y-8 mb-16">
            <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">This certificate of completion is awarded to</p>
            <h2 className="text-6xl md:text-8xl font-brand font-black text-gray-800 tracking-tight italic underline decoration-spanish-gold underline-offset-[12px]">
              {studentName || 'Elite Student'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              For successfully completing the <b>A1 Beginner Mastery Course</b>, demonstrating exceptional dedication to the Spanish language, its grammar, and conversational fluency.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 mt-10">
            <div className="text-center">
              <div className="w-48 h-0.5 bg-gray-200 mb-4 mx-auto"></div>
              <p className="font-brand font-black text-gray-800 uppercase text-xs">Carolina</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master Instructor</p>
            </div>
            <div className="w-24 h-24 bg-spanish-gold/10 rounded-full flex items-center justify-center border-2 border-spanish-gold/30">
               <ShieldCheck size={40} className="text-spanish-red" />
            </div>
            <div className="text-center">
              <div className="w-48 h-0.5 bg-gray-200 mb-4 mx-auto"></div>
              <p className="font-brand font-black text-gray-800 uppercase text-xs">{new Date().toLocaleDateString()}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date of Achievement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 no-print">
        <button onClick={handlePrint} className="bg-spanish-red text-white px-12 py-6 rounded-[2rem] font-brand font-black flex items-center gap-4 shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs">
          <Printer size={20} /> Print Certificate
        </button>
        <button className="bg-white text-gray-800 border-4 border-spanish-gold/20 px-12 py-6 rounded-[2rem] font-brand font-black flex items-center gap-4 shadow-xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs">
          <Share2 size={20} /> Share Achievement
        </button>
      </div>

      <div className="max-w-2xl mx-auto text-center bg-spanish-gold/10 p-12 rounded-[3.5rem] border-2 border-spanish-gold/30">
        <h3 className="font-brand font-black text-3xl text-spanish-red mb-4 uppercase">Ready for Level A2?</h3>
        <p className="text-gray-600 font-bold mb-8">You've mastered the basics. Now it's time to go deeper. The <b>A2 Academy</b> is waiting for you with advanced roleplays and professional fluency.</p>
        <div className="inline-flex items-center gap-4 px-8 py-3 bg-spanish-red text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
           Upgrade Intermediate • Coming Soon
        </div>
      </div>
    </div>
  );
};
