
import React from 'react';
import { UserAccount, AppSection } from '../types';
import { 
  Trophy, History, Star, Target, TrendingUp, 
  Award, Calendar, ArrowLeft, ShieldCheck, Mail,
  LogOut
} from 'lucide-react';

interface ProfileSectionProps {
  user: UserAccount;
  onNavigate: (section: AppSection) => void;
  onLogout: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button onClick={() => onNavigate(AppSection.HOME)} className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-spanish-red transition-colors">
          <ArrowLeft size={16}/> Volver al Dashboard
        </button>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 text-xs font-black text-red-500/60 uppercase tracking-widest hover:text-red-600 transition-colors group"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Cerrar Sesión
        </button>
      </div>

      {/* User Identity Card */}
      <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-b-[12px] border-spanish-gold/20 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="w-40 h-40 bg-gradient-to-br from-spanish-red to-red-800 rounded-[3rem] flex items-center justify-center text-white font-brand font-black text-6xl shadow-xl ring-8 ring-white shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <h2 className="text-4xl md:text-5xl font-brand font-black text-gray-800 uppercase tracking-tighter leading-none">{user.name}</h2>
            <span className="bg-spanish-gold text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest self-center md:self-auto shadow-md">LVL {user.stats.level} Student</span>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center md:justify-start gap-2">
            <Mail size={12} /> {user.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
            <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
              <Star size={18} fill="currentColor" />
              <span className="font-brand font-black text-sm">{user.stats.xp} Total XP</span>
            </div>
            <div className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 flex items-center gap-3">
              <Award size={18} />
              <span className="font-brand font-black text-sm">{user.completedModules.length} Modules</span>
            </div>
          </div>
        </div>

        {/* Floating Logout for Card */}
        <button 
          onClick={onLogout}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm group border border-transparent hover:border-red-100 hidden md:flex"
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Progress Overview */}
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100">
            <h3 className="font-brand font-black text-2xl text-gray-800 uppercase mb-10 flex items-center gap-4">
              <TrendingUp className="text-spanish-red" /> Learning Progress
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[11px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                  <span>Course Mastery</span>
                  <span>{Math.round((user.completedModules.length / 5) * 100)}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                  <div 
                    className="h-full bg-spanish-red rounded-full transition-all duration-1000" 
                    style={{ width: `${(user.completedModules.length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tasks Done</p>
                   <p className="text-3xl font-brand font-black text-gray-800">{user.completedTasks.length}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">XP Points</p>
                   <p className="text-3xl font-brand font-black text-spanish-gold">{user.stats.xp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100">
            <h3 className="font-brand font-black text-2xl text-gray-800 uppercase mb-10 flex items-center gap-4">
              <History className="text-spanish-red" /> Activity Feed
            </h3>
            <div className="space-y-6">
              {user.activityLog.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <History size={64} className="mx-auto mb-4" />
                  <p className="font-bold uppercase text-xs tracking-widest">No activity recorded yet</p>
                </div>
              ) : (
                user.activityLog.slice().reverse().map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-spanish-gold/30 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-spanish-red shadow-sm border border-gray-100">
                        <Target size={20} />
                      </div>
                      <div>
                        <p className="font-brand font-black text-sm text-gray-800 uppercase tracking-tight">{act.action}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {new Date(act.timestamp).toLocaleDateString()} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-spanish-gold/10 text-spanish-gold px-4 py-2 rounded-xl font-brand font-black text-xs">
                      +{act.xpEarned} XP
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Achievements */}
        <div className="space-y-10">
           <div className="bg-gradient-to-br from-spanish-red to-red-800 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
                <ShieldCheck size={120} />
              </div>
              <h3 className="font-brand font-black text-3xl uppercase tracking-tighter mb-10 relative z-10">My Badges</h3>
              <div className="grid grid-cols-3 gap-6 relative z-10">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const isEarned = user.completedModules.includes(i);
                  return (
                    <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isEarned ? 'bg-white/20 border-white/40 shadow-xl scale-110' : 'bg-black/10 border-transparent opacity-20'}`}>
                      <Trophy size={isEarned ? 32 : 24} className={isEarned ? 'text-spanish-gold' : 'text-white'} />
                    </div>
                  );
                })}
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-10 text-white/50 relative z-10">
                Unlock higher modules to earn elite mastery badges.
              </p>
           </div>

           <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-gray-100 text-center">
              <Calendar className="mx-auto text-spanish-gold mb-6" size={56} />
              <h4 className="font-brand font-black text-3xl text-gray-800 uppercase tracking-tighter">Member Since</h4>
              <p className="text-spanish-red font-black text-sm uppercase tracking-[0.2em] mt-2">Class of 2025</p>
           </div>
        </div>
      </div>
    </div>
  );
};
