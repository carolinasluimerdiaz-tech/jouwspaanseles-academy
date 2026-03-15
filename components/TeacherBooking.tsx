
import React, { useState } from 'react';
import { TEACHERS } from '../constants';
import { Teacher, AppSection } from '../types'; // Import AppSection
import { Calendar, Clock, UserCheck, Video, Star, DollarSign, ExternalLink, Package, CalendarDays, XCircle, Sparkles, Zap, Award, ChevronRight, Users } from 'lucide-react';

interface TeacherBookingProps {
  onNavigate: (section: AppSection) => void; // Added onNavigate prop
}

export const TeacherBooking: React.FC<TeacherBookingProps> = ({ onNavigate }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Wednesday');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'Zoom' | 'Teams'>('Zoom');
  const [selectedPackage, setSelectedPackage] = useState<'bundle8' | 'monthly'>('bundle8');
  
  // Track booked slots locally for demonstration (persists only in session)
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const availabilityCET: Record<string, string[]> = {
    'Wednesday': ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '08:30 PM', '09:45 PM'],
    'Thursday': ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '08:30 PM', '09:45 PM'],
    'Friday': ['08:30 PM']
  };

  const handleBooking = () => {
    if (!selectedTime || !selectedTeacher) return;
    
    const slotKey = `${selectedDay}-${selectedTime}`;
    const price = selectedTeacher.pricing[selectedPackage];
    const packageType = selectedPackage === 'bundle8' ? '8 Classes Package' : 'Monthly Subscription';
    
    alert(`Success!\n\nInstructor: ${selectedTeacher.name}\nDay: ${selectedDay}\nTime: ${selectedTime} (CET)\nPlatform: ${selectedPlatform}\nPackage: ${packageType}\nPrice: $${price}\n\nCheck your email for the link!`);
    
    setBookedSlots(prev => [...prev, slotKey]);
    setSelectedTeacher(null);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      {/* Premium Hero Section */}
      <div className="bg-gradient-to-br from-spanish-red via-spanish-red to-spanish-gold p-1 md:p-1.5 rounded-[4rem] shadow-2xl overflow-hidden group">
        <div className="bg-white/5 backdrop-blur-2xl p-12 md:p-20 rounded-[3.8rem] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-spanish-gold/20 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-spanish-red/20 rounded-full -ml-32 -mb-32 blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-4 bg-white/10 px-8 py-3 rounded-full border border-white/20 mb-10 backdrop-blur-md">
              <Zap className="text-spanish-gold animate-bounce" size={20} />
              <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Human-to-Human Mastery</span>
            </div>
            <h4 className="font-brand font-black text-6xl md:text-8xl text-white mb-8 tracking-tighter leading-none">
              Accelerate <br/><span className="text-spanish-gold underline decoration-white underline-offset-[16px]">Your Fluency</span>
            </h4>
            <p className="text-white/80 font-medium leading-relaxed max-w-2xl text-xl italic">
              "Private sessions are the secret to rapid progress." Book with Carolina and experience elite Spanish training.
            </p>
          </div>

          <div className="relative shrink-0 hidden lg:block">
             <div className="w-64 h-64 bg-white/10 rounded-[3rem] border-2 border-white/20 flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-1000 backdrop-blur-lg">
                <Award size={120} className="text-white/20" />
             </div>
          </div>
        </div>
      </div>

      {/* Instructor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {TEACHERS.map((teacher) => (
          <div key={teacher.id} className="bg-white p-1 md:p-1.5 rounded-[5rem] shadow-2xl border border-spanish-gold/20 hover:scale-[1.02] transition-all group relative overflow-hidden">
            <div className="bg-white p-12 rounded-[4.8rem] flex flex-col h-full relative z-10">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-tr from-spanish-red to-spanish-gold rounded-[4rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                  <div className="w-56 h-56 rounded-[3.5rem] border-[10px] border-white shadow-2xl bg-gray-50 flex items-center justify-center relative z-10">
                     <Users size={80} className="text-spanish-gold/20" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-spanish-red text-white p-4 rounded-[1.5rem] border-8 border-white shadow-2xl z-20">
                    <UserCheck size={28} />
                  </div>
                </div>
                <h3 className="font-brand font-black text-5xl text-gray-800 tracking-tighter mb-4">{teacher.name}</h3>
                <div className="flex items-center gap-3 bg-spanish-gold/10 px-6 py-2 rounded-full border border-spanish-gold/20">
                  <Star fill="#F1BF00" className="text-spanish-gold" size={24} />
                  <span className="text-xl font-black text-spanish-red">{teacher.rating} Verified</span>
                </div>
              </div>

              <div className="bg-spanish-gold/5 p-10 rounded-[3.5rem] mb-12 border-2 border-dashed border-spanish-gold/20 group-hover:border-spanish-red/20 transition-colors shadow-inner">
                <p className="text-gray-600 font-bold text-center leading-relaxed italic text-lg">
                  {teacher.name === 'Carolina' ? 
                    "Certified Spanish teacher with a diploma from the Netherlands, CEO of Zayrolingua, and online class specialist. An expert in conversation-based learning, ensuring students speak Spanish from Day 1 while providing expert guidance in Spanish grammar." : 
                    `"${teacher.bio}"`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-12 mt-auto">
                <div className={`p-8 rounded-[3rem] transition-all flex flex-col items-center gap-2 border-4 cursor-pointer ${selectedPackage === 'bundle8' ? 'border-spanish-red bg-red-50' : 'border-gray-50 bg-white'}`} onClick={() => setSelectedPackage('bundle8')}>
                  <Package size={32} className="text-spanish-red mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">8 Class Pack</p>
                  <p className="font-brand font-black text-4xl text-gray-800">${teacher.pricing.bundle8}</p>
                </div>
                <div className={`p-8 rounded-[3rem] transition-all flex flex-col items-center gap-2 border-4 cursor-pointer ${selectedPackage === 'monthly' ? 'border-spanish-gold bg-yellow-50' : 'border-gray-50 bg-white'}`} onClick={() => setSelectedPackage('monthly')}>
                  <CalendarDays size={32} className="text-spanish-gold mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Sub</p>
                  <p className="font-brand font-black text-4xl text-gray-800">${teacher.pricing.monthly}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTeacher(teacher)}
                className="w-full bg-gradient-to-r from-spanish-red to-red-700 text-white py-10 rounded-[3rem] font-brand font-black text-xl hover:shadow-[0_20px_50px_rgba(170,21,27,0.4)] transition-all shadow-xl active:scale-95 uppercase tracking-[0.3em] flex items-center justify-center gap-4"
              >
                Book with {teacher.name} <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-[120] bg-spanish-red/80 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[5rem] shadow-2xl relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar border-[12px] border-white">
              <button onClick={() => setSelectedTeacher(null)} className="absolute top-10 right-10 text-gray-300 hover:text-spanish-red transition-all p-2 bg-gray-100 rounded-full">
                 <XCircle size={48} />
              </button>
              
              <div className="p-16 space-y-16">
                 <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-gray-50 flex items-center justify-center shadow-2xl border-8 border-spanish-gold/20">
                        <Users size={48} className="text-spanish-gold/20" />
                    </div>
                    <div className="text-center md:text-left">
                       <h3 className="font-brand font-black text-5xl text-gray-800 tracking-tighter">Booking: {selectedTeacher.name}</h3>
                       <p className="text-spanish-red font-bold uppercase tracking-widest text-xs mt-4">CET Timezone (Central Europe)</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                       <section>
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-4">
                             <Calendar size={24} className="text-spanish-red" /> 1. Select Day
                          </h4>
                          <div className="flex gap-4">
                             {['Wednesday', 'Thursday', 'Friday'].map(day => (
                               <button 
                                 key={day}
                                 onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                                 className={`flex-1 py-4 rounded-[1.5rem] font-black transition-all text-xs border-2 ${selectedDay === day ? 'bg-spanish-red text-white border-spanish-red' : 'bg-gray-50 text-gray-400 border-transparent hover:border-spanish-red/30'}`}
                               >
                                 {day}
                               </button>
                             ))}
                          </div>
                       </section>

                       <section>
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-4">
                             <Clock size={24} className="text-spanish-red" /> 2. Select Time (CET)
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                             {availabilityCET[selectedDay].map(time => {
                               const slotKey = `${selectedDay}-${time}`;
                               const isBooked = bookedSlots.includes(slotKey);
                               return (
                                 <button 
                                   key={time}
                                   disabled={isBooked}
                                   onClick={() => setSelectedTime(time)}
                                   className={`px-6 py-5 rounded-[1.8rem] font-black transition-all text-sm border-2 ${isBooked ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed line-through' : selectedTime === time ? 'bg-spanish-red text-white border-spanish-red shadow-2xl scale-105' : 'bg-gray-50 text-gray-500 border-transparent hover:border-spanish-red/30'}`}
                                 >
                                   {isBooked ? 'Booked' : time}
                                 </button>
                               );
                             })}
                          </div>
                       </section>

                       <section>
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-4">
                             <Video size={24} className="text-spanish-red" /> 3. Preferred Platform
                          </h4>
                          <div className="flex gap-4">
                             <button 
                               onClick={() => setSelectedPlatform('Zoom')}
                               className={`flex-1 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 ${selectedPlatform === 'Zoom' ? 'border-blue-500 bg-blue-50' : 'border-gray-50 hover:bg-gray-100'}`}
                             >
                                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><ExternalLink size={28}/></div>
                                <span className="font-brand font-black text-blue-900 uppercase text-[9px] tracking-widest">Zoom</span>
                             </button>
                             <button 
                                onClick={() => setSelectedPlatform('Teams')}
                                className={`flex-1 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 ${selectedPlatform === 'Teams' ? 'border-purple-500 bg-purple-50' : 'border-gray-50 hover:bg-gray-100'}`}
                             >
                                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><ExternalLink size={28}/></div>
                                <span className="font-brand font-black text-purple-900 uppercase text-[9px] tracking-widest">Teams</span>
                             </button>
                          </div>
                       </section>
                    </div>

                    <div className="bg-spanish-gold/5 p-12 rounded-[4rem] border-2 border-spanish-gold/20 flex flex-col justify-between shadow-inner">
                       <div>
                          <h5 className="font-brand font-black text-gray-800 uppercase text-xs tracking-widest mb-10 border-b border-spanish-gold/20 pb-6">Summary</h5>
                          <div className="space-y-6">
                             <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-sm">Package</span>
                                <span className="font-black text-gray-800 text-sm uppercase">{selectedPackage === 'bundle8' ? '8 Classes' : 'Monthly Sub'}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-sm">Schedule</span>
                                <span className="font-black text-gray-800 text-sm uppercase">{selectedDay} {selectedTime || '...'}</span>
                             </div>
                             <div className="flex justify-between items-center pt-6 border-t border-spanish-gold/20 text-spanish-red">
                                <span className="font-black uppercase tracking-widest text-xs">Total Investment</span>
                                <span className="text-5xl font-brand font-black">${selectedTeacher.pricing[selectedPackage]}</span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={handleBooking}
                         disabled={!selectedTime}
                         className="w-full bg-spanish-red text-white py-10 rounded-[2.5rem] font-brand font-black shadow-2xl hover:shadow-[0_20px_50px_rgba(170,21,27,0.4)] transition-all disabled:opacity-20 uppercase tracking-[0.3em] text-xs mt-12 flex items-center justify-center gap-4"
                       >
                         Unlock Mastery <Sparkles size={20} className="animate-pulse" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};