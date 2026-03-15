
export enum AppSection {
  HOME = 'HOME',
  STUDY_PLAN = 'STUDY_PLAN',
  MASTERCLASSES = 'MASTERCLASSES',
  CAROLINA_AI = 'CAROLINA_AI',
  GAMES = 'GAMES',
  BOOKING = 'BOOKING',
  DIPLOMA = 'DIPLOMA',
  LATAM_CAROLINA_AI = 'LATAM_CAROLINA_AI',
  PROFILE = 'PROFILE',
  CHALLENGE_ZONE = 'CHALLENGE_ZONE',
  SPANISH_CULTURE = 'SPANISH_CULTURE'
}

export enum LanguageOption {
  SPANISH_FOR_ENGLISH = 'SPANISH_FOR_ENGLISH',
  SPANISH_FOR_DUTCH = 'SPANISH_FOR_DUTCH',
  ENGLISH_FOR_SPANISH = 'ENGLISH_FOR_SPANISH',
  JAPANESE_FOR_SPANISH = 'JAPANESE_FOR_SPANISH'
}

export interface Activity {
  id: string;
  action: string;
  timestamp: number;
  xpEarned: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  medals: string[];
  dailyUsageMinutes?: number;
  lastUsageDate?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  stats: UserStats;
  completedModules: number[];
  completedVideos: string[];
  completedTasks: number[];
  activityLog: Activity[];
  isFreeUser: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  errorText?: string;
  englishTranslation?: string;
  showTranslation?: boolean;
  isTranslating?: boolean;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  module: number;
  thumbnail: string;
  url: string;
  instructions?: string;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  img: string;
  pricing: { bundle8: number; monthly: number };
  rating: number;
  availability: string[];
  platforms: ('Zoom' | 'Teams')[];
}

export interface SpeechGenerationResult {
  audioData: string | null;
  error?: {
    type: 'API_ERROR' | 'EMPTY_TEXT' | 'UNKNOWN';
    message: string;
  };
}

export type LatamCountry = 'Mexico' | 'Colombia' | 'Argentina' | 'Chile' | 'Dominican Republic';

export interface ZayroSummary {
  strengths: string;
  corrections: {
    said: string;
    better: string;
    why: string;
  }[];
  missionStatus: 'Lograda ✅' | 'En progreso ⏳';
  missionFeedback: string;
  proWords: string[];
}
