import { create } from 'zustand';

export interface UserProfile {
  lookingFor: 'casual' | 'serious' | 'not-sure' | null;
  communicationStyle: 'text-a-lot' | 'balanced' | 'only-when-needed' | null;
  conflictHandling: 'talk-immediately' | 'take-time' | 'avoid' | null;
  corePriority: 'trust' | 'fun' | 'stability' | 'growth' | null;
  nonNegotiable: string;
}

export interface BackendProfile {
  id: string;
  name: string;
  age: number;
  lookingFor: 'casual' | 'serious' | 'not-sure';
  communicationStyle: 'text-a-lot' | 'balanced' | 'only-when-needed';
  conflictHandling: 'talk-immediately' | 'take-time' | 'avoid';
  corePriority: 'trust' | 'fun' | 'stability' | 'growth';
  nonNegotiable: string;
  bio: string;
}

export interface CompatibilityResult {
  matchedProfile: BackendProfile;
  score: number;
  whySelected: string;
  greenSignals: string[];
  yellowSignals: string[];
  redSignals: string[];
  suggestion: string;
}

interface AppState {
  userProfile: UserProfile;
  compatibilityResult: CompatibilityResult | null;
  isAnalyzing: boolean;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setCompatibilityResult: (result: CompatibilityResult | null) => void;
  setIsAnalyzing: (value: boolean) => void;
  resetProfile: () => void;
}

const initialProfile: UserProfile = {
  lookingFor: null,
  communicationStyle: null,
  conflictHandling: null,
  corePriority: null,
  nonNegotiable: '',
};

export const useAppStore = create<AppState>((set) => ({
  userProfile: initialProfile,
  compatibilityResult: null,
  isAnalyzing: false,
  setUserProfile: (profile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...profile },
    })),
  setCompatibilityResult: (result) => set({ compatibilityResult: result }),
  setIsAnalyzing: (value) => set({ isAnalyzing: value }),
  resetProfile: () => set({ userProfile: initialProfile, compatibilityResult: null }),
}));
