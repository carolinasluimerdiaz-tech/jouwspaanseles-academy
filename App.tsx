
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppSection, UserAccount, Activity, LanguageOption } from './types';
import { ModernHeader } from './components/IncaHeader';
import { ChatInterface } from './components/ChatInterface';
import { VideoSection } from './components/VideoSection';
import { GamesSection } from './components/GamesSection';
import { ChallengeSection } from './components/ChallengeSection';
import { TeacherBooking } from './components/TeacherBooking';
import { CertificateSection } from './components/CertificateSection';
import { ProfileSection } from './components/ProfileSection';
import { ChallengeZone } from './components/ChallengeZone';
import { CultureSection } from './components/CultureSection';
import { databaseService } from './services/databaseService';
import { emailService } from './services/emailService';
import { 
  Home as HomeIcon, 
  MessageSquare, 
  PlayCircle, 
  Users,
  Award,
  Gamepad,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  KeyRound,
  Brain,
  Star,
  LogOut,
  Languages,
  Menu,
  User as UserIcon,
  Mail,
  UserPlus,
  LogIn,
  Send,
  Shield,
  Flame,
  X,
  Globe,
  Trophy,
  Flag
} from 'lucide-react';
import { LatamChatInterface } from './components/LatamChatInterface';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-spanish-flag splash-exit ${exit ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative mb-10 animate-rotate-sun">
        <svg width="150" height="150" viewBox="0 0 100 100" className="animate-pulse-sun">
          <circle cx="50" cy="50" r="35" fill="#AA151B" />
          {[...Array(8)].map((_, i) => (
            <rect key={i} x="48" y="5" width="4" height="20" fill="#F1BF00" transform={`rotate(${i * 45} 50 50)`} rx="2" />
          ))}
          <text x="50" y="60" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Montserrat">Z</text>
        </svg>
      </div>
      <h1 className="text-4xl font-brand font-black text-white tracking-tighter animate-logo uppercase">
        ZAYRO<span className="text-spanish-gold">LINGUA</span>
      </h1>
    </div>
  );
};

const LanguageSelector: React.FC<{ onSelect: (lang: LanguageOption) => void }> = ({ onSelect }) => {
  const options = [
    { 
      id: LanguageOption.SPANISH_FOR_ENGLISH, 
      label: 'Learn Spanish', 
      sub: 'For English Speakers', 
      icon: <div className="flex gap-1"><Flag className="text-red-500" size={20} /><Flag className="text-blue-500" size={20} /></div>,
      color: 'bg-spanish-red',
      glow: 'shadow-red-500/40'
    },
    { 
      id: LanguageOption.SPANISH_FOR_DUTCH, 
      label: 'Spaans Leren', 
      sub: 'Voor Nederlandstaligen', 
      icon: <div className="flex gap-1"><Flag className="text-orange-500" size={20} /><Flag className="text-red-500" size={20} /></div>,
      color: 'bg-orange-500',
      glow: 'shadow-orange-500/40'
    },
    { 
      id: LanguageOption.ENGLISH_FOR_SPANISH, 
      label: 'Aprender Inglés', 
      sub: 'Para Hispanohablantes', 
      icon: <div className="flex gap-1"><Flag className="text-blue-600" size={20} /><Flag className="text-red-600" size={20} /></div>,
      color: 'bg-blue-600',
      glow: 'shadow-blue-600/40'
    },
    { 
      id: LanguageOption.JAPANESE_FOR_SPANISH, 
      label: 'Aprender Japonés', 
      sub: 'Para Hispanohablantes', 
      icon: <div className="flex gap-1"><Flag className="text-red-500" size={20} /><div className="w-5 h-5 rounded-full bg-red-500 border border-gray-100"></div></div>,
      color: 'bg-pink-500',
      glow: 'shadow-pink-500/40'
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#fdfcf6] flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-spanish-red/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-6xl w-full text-center space-y-20 py-24 relative z-10">
        <div className="space-y-6">
          <div className="inline-block px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 mb-4">
            <p className="text-spanish-red font-black uppercase tracking-[0.5em] text-[10px]">ZayroLingua Academy</p>
          </div>
          <h1 className="text-7xl md:text-8xl font-brand font-black text-gray-800 uppercase tracking-tighter leading-none">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-spanish-red via-spanish-gold to-blue-500">Language</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {options.map((opt) => (
            <button 
              key={opt.id} 
              onClick={() => onSelect(opt.id)}
              className={`group relative bg-white p-12 rounded-[4rem] shadow-2xl border-b-[16px] border-gray-100 hover:border-${opt.color.split('-')[1]}-500 transition-all hover:scale-[1.02] active:scale-95 text-left flex flex-col justify-between h-80 overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${opt.color} opacity-5 rounded-bl-[8rem] group-hover:scale-110 transition-transform`}></div>
              <div className="space-y-4 relative z-10">
                <div className={`w-16 h-16 ${opt.color} rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:rotate-12 transition-transform`}>
                  {opt.icon}
                </div>
                <h3 className="text-4xl font-brand font-black text-gray-800 uppercase tracking-tighter leading-none">{opt.label}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{opt.sub}</p>
              </div>
              <div className="flex items-center gap-2 text-spanish-red font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                Start Adventure <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-12">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Global Learning Method • 2026</p>
        </div>
      </div>
    </div>
  );
};

const AuthGate: React.FC<{ onLogin: (user: UserAccount) => void }> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'SUCCESS_REG'>('LOGIN');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', permissionCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserAccount | null>(null);

  const CREATOR_EMAIL = 'jouwspaanseles@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mode === 'REGISTER') {
      const newUser: UserAccount = {
        name: formData.name,
        email: (formData.email || '').toLowerCase(),
        password: formData.password,
        stats: { 
          xp: 0, 
          level: 1, 
          streak: 1, 
          hearts: 5, 
          medals: [],
          dailyUsageMinutes: 0,
          lastUsageDate: new Date().toISOString().split('T')[0]
        },
        completedModules: [],
        completedVideos: [],
        completedTasks: [],
        activityLog: [{ id: Date.now().toString(), action: '¡Bienvenido a la Academia!', timestamp: Date.now(), xpEarned: 100 }],
        isFreeUser: false
      };

      const result = await databaseService.createUser(newUser);
      if (result.success) {
        setRegisteredUser(newUser);
        setMode('SUCCESS_REG');
        emailService.sendWelcomeEmail(newUser);
        emailService.notifyAdmin(newUser);
      } else {
        setError(result.error || 'Fallo en el registro.');
      }
      setLoading(false);
    } else if (mode === 'FORGOT') {
      // For forgot password, we'll just show a message for now as we don't have a specific endpoint
      setError(`Si tu correo está registrado, recibirás instrucciones en breve.`);
      setLoading(false);
    } else {
      const result = await databaseService.login(formData.email, formData.password);
      
      if (result.success && result.user) {
        databaseService.setActiveSession(result.user.email);
        onLogin(result.user);
      } else {
        setError(result.error || 'Email o contraseña inválidos.');
        setLoading(false);
      }
    }
  };

  const handleSendTestEmail = async () => {
    setLoading(true);
    setError('');
    const result = await emailService.sendTestEmail('carolinasluimerdiaz@gmail.com', 'Test User', 'TestPass123');
    if (result.success) {
      setError('Éxito: Email de prueba enviado a carolinasluimerdiaz@gmail.com');
    } else {
      setError(`Error: ${result.error}. Asegúrate de configurar EMAIL_PASS en los ajustes.`);
    }
    setLoading(false);
  };

  if (mode === 'SUCCESS_REG' && registeredUser) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#fdfcf6] flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-[5rem] shadow-2xl p-16 text-center border-t-[24px] border-spanish-red animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={180} /></div>
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg border border-green-100">
            <Send size={48} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-brand font-black text-gray-800 uppercase tracking-tighter mb-4">Email Sent!</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">
            From: <span className="text-spanish-red underline">jouwspaanseles@gmail.com</span>
          </p>
          <div className="bg-gray-50 p-12 rounded-[3.5rem] border-2 border-dashed border-gray-200 text-left space-y-6 mb-12 relative">
             <div className="absolute top-6 right-8 opacity-20 rotate-12"><Star size={64} className="text-spanish-gold" fill="currentColor" /></div>
             <p className="text-gray-400 font-black text-[9px] uppercase tracking-[0.3em] border-b border-gray-200 pb-4">Digital Enrollment Receipt</p>
             <div>
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Academy ID</p>
               <p className="font-brand font-black text-gray-800 text-xl">{registeredUser.email}</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Status</p>
               <p className="font-brand font-black text-spanish-red text-xl tracking-widest">ACTIVE STUDENT</p>
             </div>
          </div>
          <p className="text-gray-400 text-[11px] font-bold italic mb-12 leading-relaxed">
            "A welcome message has been sent to your email. <br/>Welcome to the ZayroLingua family!"
          </p>
          <button onClick={() => { databaseService.setActiveSession(registeredUser.email); onLogin(registeredUser); }} 
            className="w-full bg-spanish-red text-white py-8 rounded-[2rem] font-brand font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            Enter the Academy <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-[#fdfcf6] flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[5rem] shadow-2xl overflow-hidden border border-gray-100 min-h-[750px]">
        <div className="hidden lg:block relative bg-spanish-red overflow-hidden">
          <img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=2074" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-spanish-red to-transparent"></div>
          <div className="absolute bottom-20 left-20 space-y-6">
            <div className="w-16 h-16 bg-spanish-gold rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white rotate-12"><ShieldCheck size={32} className="text-white" /></div>
            <h2 className="text-white font-brand font-black text-7xl uppercase leading-none tracking-tighter">Student<br/><span className="text-spanish-gold underline decoration-white underline-offset-8 italic">Portal</span></h2>
            <p className="text-white/80 font-bold uppercase tracking-[0.4em] text-xs">Unlock your Spanish potential.</p>
          </div>
        </div>
        <div className="p-16 md:p-24 flex flex-col justify-center bg-white">
          <div className="mb-12 flex flex-col items-center lg:items-start">
            <div className="w-16 h-16 bg-spanish-red rounded-2xl flex items-center justify-center text-white font-brand font-black text-2xl shadow-xl mb-10 group hover:rotate-12 transition-transform">Z</div>
            <h1 className="text-4xl font-brand font-black text-gray-800 uppercase tracking-tighter mb-4">
              {mode === 'LOGIN' ? 'Welcome Back' : mode === 'FORGOT' ? 'Recovery' : 'Join Us'}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {mode === 'LOGIN' ? 'Continue your journey' : mode === 'FORGOT' ? 'Support: jouwspaanseles@gmail.com' : 'Start your path to professional fluency'}
            </p>
          </div>
          {mode !== 'FORGOT' && (
            <div className="flex gap-4 mb-10">
              <button onClick={() => setMode('LOGIN')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${mode === 'LOGIN' ? 'bg-spanish-red text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}><LogIn size={16} /> Login</button>
              <button onClick={() => setMode('REGISTER')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${mode === 'REGISTER' ? 'bg-spanish-red text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}><UserPlus size={16} /> Register</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'REGISTER' && (
              <div className="relative group">
                <UserIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-spanish-gold" size={20} />
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="FULL NAME" className="w-full bg-gray-50 rounded-[2.2rem] py-8 pl-20 pr-8 font-black uppercase tracking-widest text-xs text-gray-700 outline-none border-4 border-transparent focus:border-spanish-gold/20 shadow-inner" />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-spanish-gold" size={20} />
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="EMAIL ADDRESS" className="w-full bg-gray-50 rounded-[2.2rem] py-8 pl-20 pr-8 font-black uppercase tracking-widest text-xs text-gray-700 outline-none border-4 border-transparent focus:border-spanish-gold/20 shadow-inner" />
            </div>
            {mode !== 'FORGOT' && (
              <div className="relative group">
                <KeyRound className="absolute left-8 top-1/2 -translate-y-1/2 text-spanish-gold" size={20} />
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="PASSWORD" className="w-full bg-gray-50 rounded-[2.2rem] py-8 pl-20 pr-8 font-black uppercase tracking-widest text-xs text-gray-700 outline-none border-4 border-transparent focus:border-spanish-gold/20 shadow-inner" />
              </div>
            )}
            {error && <p className={`font-black text-[10px] uppercase text-center ${error.includes('Éxito') || error.includes('Success') ? 'text-green-500 bg-green-50 py-3 rounded-xl' : 'text-red-500'}`}>{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-spanish-red text-white py-9 rounded-[2.2rem] font-brand font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:brightness-110 transition-all mt-6 text-sm">
              {loading ? <Loader2 className="animate-spin" /> : mode === 'LOGIN' ? 'Access Academy' : mode === 'REGISTER' ? 'Create Account' : 'Recover Password'}
            </button>
            
            {(formData.email || '').toLowerCase() === (CREATOR_EMAIL || '').toLowerCase() && mode === 'LOGIN' && (
              <button type="button" onClick={handleSendTestEmail} disabled={loading} className="w-full mt-4 bg-spanish-gold text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:brightness-110 transition-all">
                Send Test Email to Carolina
              </button>
            )}
            <div className="flex justify-center mt-10">
              <button type="button" onClick={() => setMode(mode === 'FORGOT' ? 'LOGIN' : 'FORGOT')} className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-spanish-red border-b-2 border-transparent hover:border-spanish-red pb-1">
                {mode === 'FORGOT' ? 'Back to Login' : 'Forgot password?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LevelSelector: React.FC<{ onSelect: (level: string) => void }> = ({ onSelect }) => {
  const levels = [
    { id: 'A1', label: 'A1', title: 'Principiante', description: 'Fundamentos básicos', unlocked: true, color: 'bg-[#FF4B4B]', border: 'border-red-100', shadow: 'shadow-red-400/40', accent: 'text-[#FF4B4B]', bgLight: 'bg-red-50' },
    { id: 'A2', label: 'A2', title: 'Elemental', description: 'Comunicación cotidiana', unlocked: false, color: 'bg-[#1CB0F6]', border: 'border-blue-100', shadow: 'shadow-blue-400/40', accent: 'text-[#1CB0F6]', bgLight: 'bg-blue-50' },
    { id: 'B1', label: 'B1', title: 'Intermedio', description: 'Independencia lingüística', unlocked: false, color: 'bg-[#78C800]', border: 'border-emerald-100', shadow: 'shadow-emerald-400/40', accent: 'text-[#78C800]', bgLight: 'bg-emerald-50' },
    { id: 'B2', label: 'B2', title: 'Intermedio Alto', description: 'Fluidez y precisión', unlocked: false, color: 'bg-[#FF9600]', border: 'border-amber-100', shadow: 'shadow-amber-400/40', accent: 'text-[#FF9600]', bgLight: 'bg-amber-50' },
    { id: 'C1', label: 'C1', title: 'Avanzado', description: 'Dominio profesional', unlocked: false, color: 'bg-[#CE82FF]', border: 'border-purple-100', shadow: 'shadow-purple-400/40', accent: 'text-[#CE82FF]', bgLight: 'bg-purple-50' },
    { id: 'C2', label: 'C2', title: 'Maestría', description: 'Nivel nativo', unlocked: false, color: 'bg-[#FF4081]', border: 'border-pink-100', shadow: 'shadow-pink-400/40', accent: 'text-[#FF4081]', bgLight: 'bg-pink-50' },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#fdfcf6] flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar relative overflow-hidden">
      {/* Dynamic Rainbow Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-to-br from-red-400/20 via-orange-400/10 to-transparent rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gradient-to-tl from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-[150px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-emerald-400/10 via-amber-400/10 to-transparent rounded-full blur-[180px] animate-pulse delay-500"></div>
      
      {/* Floating Decorative Icons with Colors */}
      <div className="absolute top-10 left-10 text-red-500/30 animate-bounce delay-100"><Globe size={80} /></div>
      <div className="absolute top-40 right-20 text-amber-500/30 animate-bounce delay-300"><Sparkles size={60} /></div>
      <div className="absolute bottom-20 left-20 text-blue-500/30 animate-bounce delay-700"><Languages size={70} /></div>
      <div className="absolute bottom-40 right-10 text-emerald-500/30 animate-bounce delay-500"><Trophy size={80} /></div>
      <div className="absolute top-1/2 right-1/4 text-purple-500/20 animate-pulse"><Brain size={100} /></div>

      <div className="max-w-4xl w-full text-center space-y-24 py-32 relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white rounded-full shadow-xl border-2 border-spanish-red/10 mb-4 animate-bounce">
            <span className="flex h-3 w-3 rounded-full bg-spanish-red animate-ping"></span>
            <p className="text-spanish-red font-black uppercase tracking-[0.6em] text-xs">Tu Aventura Comienza Aquí</p>
          </div>
          <h1 className="text-8xl md:text-9xl font-brand font-black text-gray-800 uppercase tracking-tighter leading-[0.85]">
            Tu Camino <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#78C800] via-[#1CB0F6] to-[#CE82FF] animate-gradient-x">al Éxito</span>
          </h1>
        </div>

        <div className="relative flex flex-col items-center gap-24">
          {/* Vibrant Rainbow Path Line */}
          <div className="absolute top-0 bottom-0 w-6 bg-gradient-to-b from-[#FF4B4B] via-[#FF9600] via-[#78C800] via-[#1CB0F6] via-[#CE82FF] to-[#FF4081] left-1/2 -translate-x-1/2 -z-10 rounded-full opacity-30 shadow-[0_0_30px_rgba(0,0,0,0.1)]"></div>
          
          {levels.map((level, idx) => (
            <div 
              key={level.id} 
              className={`relative flex items-center gap-20 w-full max-w-3xl transition-all duration-1000 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="relative">
                <button 
                  onClick={() => level.unlocked && onSelect(level.id)}
                  disabled={!level.unlocked}
                  className={`w-44 h-44 rounded-[3rem] flex items-center justify-center font-brand font-black text-7xl shadow-2xl transition-all relative group border-[12px] ${
                    level.unlocked 
                      ? `${level.color} text-white hover:scale-110 active:scale-95 cursor-pointer border-white ${level.shadow} rotate-3 hover:rotate-0` 
                      : 'bg-white text-gray-200 cursor-not-allowed border-gray-50 grayscale opacity-40 -rotate-3'
                  }`}
                >
                  {level.label}
                  {!level.unlocked && (
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white p-4 rounded-2xl shadow-2xl border-4 border-white">
                      <KeyRound size={24} />
                    </div>
                  )}
                  {level.unlocked && (
                    <>
                      <div className="absolute -inset-8 border-4 border-spanish-gold rounded-[3.5rem] animate-ping opacity-40"></div>
                      <div className="absolute -inset-12 border-2 border-spanish-red rounded-[4rem] animate-pulse opacity-30"></div>
                      <div className="absolute -top-6 -left-6 bg-spanish-gold text-white p-3 rounded-full shadow-2xl animate-bounce">
                        <Sparkles size={28} />
                      </div>
                    </>
                  )}
                </button>
              </div>

              <div className={`flex-1 space-y-4 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-2 shadow-md ${level.unlocked ? `${level.bgLight} ${level.accent}` : 'bg-gray-50 text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${level.unlocked ? level.color : 'bg-gray-300'}`}></div>
                  Nivel {level.id}
                </div>
                <h3 className={`text-5xl font-brand font-black uppercase tracking-tight leading-none ${level.unlocked ? 'text-gray-800' : 'text-gray-300'}`}>
                  {level.title}
                </h3>
                <p className={`text-xl font-bold italic leading-tight max-w-sm ${idx % 2 === 0 ? '' : 'ml-auto'} ${level.unlocked ? 'text-gray-500' : 'text-gray-200'}`}>
                  {level.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-32">
          <button 
            onClick={() => onSelect('A1')}
            className="group relative inline-flex items-center gap-6 bg-white px-16 py-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2 border-gray-50 hover:scale-110 transition-all active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B4B]/10 via-[#FF9600]/10 to-[#78C800]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="text-spanish-gold group-hover:rotate-45 transition-transform duration-500" size={32} />
            <p className="text-lg font-brand font-black text-gray-800 uppercase tracking-[0.4em]">¡Vamos a Aprender!</p>
            <ArrowRight className="text-spanish-red group-hover:translate-x-4 transition-transform duration-500" size={32} />
          </button>
          <div className="mt-16">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.6em] opacity-50">ZayroLingua Academy • 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);
  useEffect(() => {
    const handleError = (event: PromiseRejectionEvent | ErrorEvent) => {
      console.error('Global Error Caught:', event);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [usageTimer, setUsageTimer] = useState<number>(0);
  const usageTimerRef = useRef<number>(0);

  // Sync ref with state
  useEffect(() => {
    usageTimerRef.current = usageTimer;
  }, [usageTimer]);

  useEffect(() => {
    const checkSession = async () => {
      const activeEmail = databaseService.getActiveSessionEmail();
      if (activeEmail) {
        // We use a special login check or fetch to restore session
        // For now, since we don't have a "get user" endpoint, we'll use a trick
        // or just assume the local storage email is valid and fetch it if we had an endpoint.
        // Since I want it to be robust, I'll add a "restore" logic in databaseService later
        // or just use the login endpoint with a stored token (not implemented yet).
        
        // Temporary: We'll need a way to get user data without password for session restore.
        // I'll add a simple endpoint for this in server.ts.
        try {
          const resp = await fetch(`/api/auth/user?email=${activeEmail}`);
          if (resp.ok) {
            const user = await resp.json();
            // Reset daily usage if it's a new day
            const today = new Date().toISOString().split('T')[0];
            if (user.stats.lastUsageDate !== today) {
              user.stats.dailyUsageMinutes = 0;
              user.stats.lastUsageDate = today;
              await databaseService.updateUser(user);
            }
            setCurrentUser(user);
            setUsageTimer(user.stats.dailyUsageMinutes || 0);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
        }
      }
    };
    checkSession();
  }, []);

  // Usage Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isChatting = currentSection === AppSection.CAROLINA_AI || currentSection === AppSection.LATAM_CAROLINA_AI;
    
    if (isChatting && currentUser) {
      interval = setInterval(() => {
        setUsageTimer(prev => {
          const newVal = prev + (1/60); // Add 1 second in minutes
          return newVal;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      // Sync usage to DB when leaving chat or on unmount
      if (currentUser && isChatting) {
        setCurrentUser(prev => {
          if (!prev) return null;
          const updated = {
            ...prev,
            stats: {
              ...prev.stats,
              dailyUsageMinutes: usageTimer
            }
          };
          return updated;
        });
      }
    };
  }, [currentSection, currentUser === null]);

  // Periodic sync of usage timer to database
  useEffect(() => {
    if (!currentUser) return;
    
    const interval = setInterval(() => {
      if (usageTimerRef.current > 0) {
        setCurrentUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            stats: {
              ...prev.stats,
              dailyUsageMinutes: usageTimerRef.current
            }
          };
        });
      }
    }, 30000); // Sync every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentUser === null]);

  useEffect(() => {
    if (currentUser) {
      // Use a ref to prevent unnecessary updates if the user data hasn't actually changed in a meaningful way
      // or just trust that databaseService handles it. 
      // To be safe, we can debounce this or check if it's actually different.
      databaseService.updateUser(currentUser);
    }
  }, [
    currentUser?.stats.xp, 
    currentUser?.stats.level, 
    currentUser?.stats.dailyUsageMinutes,
    currentUser?.completedModules.length, 
    currentUser?.activityLog.length
  ]);

  const addActivity = useCallback((action: string, xp: number) => {
    if (!currentUser) return;
    const activity: Activity = { id: Date.now().toString(), action, timestamp: Date.now(), xpEarned: xp };
    setCurrentUser(prev => {
      if (!prev) return null;
      // Check if this activity was already added to prevent duplicates if called multiple times in same render cycle
      if (prev.activityLog.some(a => a.action === action && Math.abs(a.timestamp - activity.timestamp) < 1000)) {
        return prev;
      }
      return {
        ...prev,
        stats: { ...prev.stats, xp: prev.stats.xp + xp },
        activityLog: [...prev.activityLog, activity]
      };
    });
  }, [currentUser === null]);

  const handleLogout = () => {
    databaseService.setActiveSession(null);
    setCurrentUser(null);
    setCurrentSection(AppSection.HOME);
  };

  const navItems = [
    { id: AppSection.HOME, icon: <HomeIcon size={20} />, label: 'Home', color: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/50' }, 
    { id: AppSection.PROFILE, icon: <UserIcon size={20} />, label: 'Progress', color: 'bg-indigo-500', text: 'text-indigo-500', glow: 'shadow-indigo-500/50' }, 
    { id: AppSection.STUDY_PLAN, icon: <Award size={20} />, label: 'Study Plan', color: 'bg-amber-500', text: 'text-amber-500', glow: 'shadow-amber-500/50' },
    { id: AppSection.CAROLINA_AI, icon: <MessageSquare size={20} />, label: 'Carolina AI', color: 'bg-rose-500', text: 'text-rose-500', glow: 'shadow-rose-500/50' },
    { id: AppSection.LATAM_CAROLINA_AI, icon: <Languages size={20} />, label: 'LATAM AI', color: 'bg-teal-500', text: 'text-teal-500', glow: 'shadow-teal-500/50', hidden: selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH }, 
    { id: AppSection.CHALLENGE_ZONE, icon: <Flame size={20} />, label: 'Challenges', color: 'bg-spanish-dark', text: 'text-spanish-gold', glow: 'shadow-orange-500/50' },
    { id: AppSection.SPANISH_CULTURE, icon: <Globe size={20} />, label: 'Culture', color: 'bg-emerald-600', text: 'text-emerald-600', glow: 'shadow-emerald-600/50' },
    { id: AppSection.MASTERCLASSES, icon: <PlayCircle size={20} />, label: 'Classes', color: 'bg-emerald-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/50', hidden: selectedLanguage === LanguageOption.JAPANESE_FOR_SPANISH },
    { id: AppSection.GAMES, icon: <Gamepad size={20} />, label: 'Games', color: 'bg-violet-500', text: 'text-violet-500', glow: 'shadow-violet-500/50' },
    { id: AppSection.BOOKING, icon: <Users size={20} />, label: 'Booking', color: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-500/50' },
    { id: AppSection.DIPLOMA, icon: <ShieldCheck size={20} />, label: 'Diploma', color: 'bg-cyan-500', text: 'text-cyan-500', glow: 'shadow-cyan-500/50' },
  ].filter(item => !item.hidden);

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;
  if (!selectedLanguage) return <LanguageSelector onSelect={setSelectedLanguage} />;
  if (!selectedLevel) return <LevelSelector onSelect={setSelectedLevel} />;
  if (!currentUser) return <AuthGate onLogin={setCurrentUser} />;

  return (
    <div className="flex h-screen bg-[#fdfcf6] overflow-hidden">
      {/* Sidebar - RESTORED FULL MENU */}
      <aside className="hidden lg:flex flex-col w-96 bg-white border-r-8 border-gray-50 p-12 overflow-y-auto no-scrollbar shadow-xl z-20">
        <div className="mb-20 flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentSection(AppSection.HOME)}>
           <div className="w-14 h-14 bg-gradient-to-br from-spanish-red to-red-700 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:rotate-12 transition-transform">Z</div>
           <div>
             <h1 className="font-brand font-black text-2xl tracking-tighter uppercase leading-none">ZayroLingua</h1>
             <p className="text-[10px] font-black text-spanish-gold uppercase tracking-[0.3em]">Latin Method <span className="text-spanish-red/40 ml-2">v1.2.5</span></p>
           </div>
        </div>
        <nav className="flex-1 space-y-3">
          {/* Daily Goal Indicator */}
          <div className="px-8 py-6 mb-4 bg-gray-50 rounded-[2.5rem] border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Diaria</span>
              <span className="text-[10px] font-black text-spanish-red uppercase tracking-widest">{Math.floor(usageTimer)} / 10 min</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${usageTimer >= 10 ? 'bg-green-500' : 'bg-spanish-red'}`} 
                style={{ width: `${Math.min(100, (usageTimer / 10) * 100)}%` }}
              ></div>
            </div>
            {usageTimer >= 10 && (
              <div className="mt-2 space-y-2">
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-tight flex items-center gap-1">
                  <Sparkles size={10} /> ¡Meta cumplida! Puedes seguir practicando.
                </p>
                <button 
                  onClick={() => setUsageTimer(0)} 
                  className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                >
                  Reiniciar Meta para hoy
                </button>
              </div>
            )}
          </div>

          {navItems.map(item => (
            <button key={item.id} onClick={() => { setCurrentSection(item.id); setShowMobileNav(false); }} className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${currentSection === item.id ? `${item.color} text-white shadow-2xl scale-105` : `text-gray-300 hover:${item.text} hover:bg-gray-50`}`}>
              <span className={`transition-transform duration-500 ${currentSection === item.id ? 'scale-125' : `group-hover:scale-110 ${item.text}`}`}>{item.icon}</span>
              {item.label}
              {currentSection === item.id && <div className="absolute right-6 w-2 h-2 bg-white rounded-full animate-pulse"></div>}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-10 text-gray-300 font-black text-[10px] uppercase flex items-center gap-4 hover:text-red-500 transition-colors"><LogOut size={16} /> Logout</button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Mobile Nav Toggle */}
        <div className="sticky top-0 lg:hidden bg-[#fdfcf6] p-6 flex items-center justify-between border-b border-gray-100 z-40 shadow-sm">
          <button onClick={() => setShowMobileNav(true)} className="text-gray-600 hover:text-spanish-red"><Menu size={28} /></button>
          <div className="w-10 h-10 bg-spanish-red rounded-xl flex items-center justify-center text-white font-black shadow-lg" onClick={() => setCurrentSection(AppSection.PROFILE)}>{currentUser.name.charAt(0).toUpperCase()}</div>
        </div>

        {showMobileNav && (
          <div className="fixed inset-0 z-[100] bg-white p-12 flex flex-col animate-in fade-in slide-in-from-left-10 overflow-y-auto h-full">
            <button onClick={() => setShowMobileNav(false)} className="self-end mb-12"><X size={32}/></button>
            <nav className="space-y-4">
              {navItems.map(item => (
                <button key={item.id} onClick={() => { setCurrentSection(item.id); setShowMobileNav(false); }} className={`w-full flex items-center gap-6 px-8 py-6 rounded-2xl font-black text-sm uppercase tracking-widest ${currentSection === item.id ? `${item.color} text-white` : 'text-gray-400'}`}>
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <ModernHeader title={navItems.find(i => i.id === currentSection)?.label || 'Home'} subtitle={`Welcome back, ${currentUser.name.split(' ')[0]}!`} xp={currentUser.stats.xp} streak={currentUser.stats.streak} hearts={currentUser.stats.hearts} />
        
        <div className="p-6 md:p-12 lg:p-20 mx-auto space-y-20">
          {currentSection === AppSection.HOME && (
            <div className="space-y-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border-t-[20px] border-spanish-gold relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><Brain size={240} /></div>
                  <div className="relative z-10">
                     <div className="inline-flex items-center gap-3 bg-red-50 text-spanish-red px-6 py-2 rounded-full border border-spanish-red/10 mb-8 font-black text-[10px] uppercase tracking-widest"><Sparkles size={16} /> Level {currentUser.stats.level} Student Access</div>
                     <h2 className="text-5xl md:text-8xl font-brand font-black text-gray-800 mb-10 uppercase tracking-tighter leading-[0.85]">Your Personal <br/><span className="text-spanish-red underline decoration-spanish-gold underline-offset-[16px]">Academy</span>.</h2>
                     <p className="text-gray-400 font-bold italic text-lg mb-10 max-w-lg">You have earned {currentUser.stats.xp} XP points. Follow your plan to reach the next level of fluency.</p>
                     <div className="flex flex-wrap gap-6">
                       <button onClick={() => setCurrentSection(AppSection.STUDY_PLAN)} className="bg-spanish-red text-white px-12 py-8 rounded-[2rem] font-brand font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.05] transition-all flex items-center justify-center gap-4 text-sm">View Roadmap <ArrowRight size={20}/></button>
                       <button onClick={() => setCurrentSection(AppSection.PROFILE)} className="bg-white border-4 border-gray-100 text-gray-800 px-12 py-8 rounded-[2rem] font-brand font-black uppercase tracking-[0.2em] hover:border-spanish-gold/30 transition-all flex items-center justify-center gap-4 text-sm shadow-xl">My Profile <UserIcon size={20}/></button>
                       {selectedLanguage !== LanguageOption.JAPANESE_FOR_SPANISH && (
                         <button onClick={() => setCurrentSection(AppSection.LATAM_CAROLINA_AI)} className="bg-teal-500 text-white px-12 py-8 rounded-[2rem] font-brand font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.05] transition-all flex items-center justify-center gap-4 text-sm">Latam AI <Languages size={20}/></button>
                       )}
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex items-center gap-6 group hover:translate-y-[-8px] transition-all">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Star size={28} fill="currentColor" /></div>
                    <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">XP Mastery</p><p className="text-3xl font-brand font-black text-gray-800">{currentUser.stats.xp}</p></div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex items-center gap-6 group hover:translate-y-[-8px] transition-all">
                    <div className="w-16 h-16 bg-spanish-gold text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
                    <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modules</p><p className="text-3xl font-brand font-black text-gray-800">{currentUser.completedModules.length} / 5</p></div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex items-center gap-6 group hover:translate-y-[-8px] transition-all">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Flame size={28} /></div>
                    <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Streak</p><p className="text-3xl font-brand font-black text-gray-800">{currentUser.stats.streak} Days</p></div>
                  </div>
                  {selectedLanguage !== LanguageOption.JAPANESE_FOR_SPANISH ? (
                    <div onClick={() => setCurrentSection(AppSection.LATAM_CAROLINA_AI)} className="bg-teal-500 p-10 rounded-[3rem] shadow-xl border border-teal-400 flex items-center gap-6 group hover:translate-y-[-8px] transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-white text-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Languages size={28} /></div>
                      <div><p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Latam AI</p><p className="text-xl font-brand font-black text-white">Practice Now</p></div>
                    </div>
                  ) : (
                    <div onClick={() => setCurrentSection(AppSection.CAROLINA_AI)} className="bg-rose-500 p-10 rounded-[3rem] shadow-xl border border-rose-400 flex items-center gap-6 group hover:translate-y-[-8px] transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><MessageSquare size={28} /></div>
                      <div><p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Carolina AI</p><p className="text-xl font-brand font-black text-white">Practice Japanese</p></div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Conditional Rendering for ALL RESTORED SECTIONS */}
          {currentSection === AppSection.PROFILE && <ProfileSection user={currentUser} onNavigate={setCurrentSection} onLogout={handleLogout} />}
          {currentSection === AppSection.MASTERCLASSES && <VideoSection onNavigate={setCurrentSection} selectedLanguage={selectedLanguage || undefined} />}
          {currentSection === AppSection.CAROLINA_AI && <ChatInterface onNavigate={setCurrentSection} selectedLanguage={selectedLanguage || undefined} currentUser={currentUser} />}
          {currentSection === AppSection.LATAM_CAROLINA_AI && <LatamChatInterface onNavigate={setCurrentSection} currentUser={currentUser} />} 
          {currentSection === AppSection.CHALLENGE_ZONE && <ChallengeZone onNavigate={setCurrentSection} selectedLanguage={selectedLanguage || undefined} />}
          {currentSection === AppSection.STUDY_PLAN && <ChallengeSection onNavigate={setCurrentSection} selectedLanguage={selectedLanguage || undefined} />}
          {currentSection === AppSection.GAMES && <GamesSection onNavigate={setCurrentSection} onExerciseComplete={addActivity} selectedLanguage={selectedLanguage || undefined} />}
          {currentSection === AppSection.SPANISH_CULTURE && <CultureSection onNavigate={setCurrentSection} onExerciseComplete={addActivity} selectedLanguage={selectedLanguage || undefined} />}
          {currentSection === AppSection.BOOKING && <TeacherBooking onNavigate={setCurrentSection} />}
          {currentSection === AppSection.DIPLOMA && <CertificateSection studentName={currentUser.name} onNavigate={setCurrentSection} />}
        </div>
      </main>
    </div>
  );
};

export default App;
