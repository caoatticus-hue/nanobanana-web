import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GenerationHistory, UserSettings, AspectRatio } from '../types';

interface AppState {
  // 状态
  history: GenerationHistory[];
  settings: UserSettings;
  currentImage: string | null;
  isGenerating: boolean;

  // 操作
  addToHistory: (item: GenerationHistory) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setCurrentImage: (image: string | null) => void;
  setGenerating: (generating: boolean) => void;
  reset: () => void;
}

const defaultSettings: UserSettings = {
  defaultEngine: 'doubao',
  defaultAspectRatio: '1:1',
  defaultImageCount: 1,
  autoSave: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      history: [],
      settings: defaultSettings,
      currentImage: null,
      isGenerating: false,

      addToHistory: (item) => {
        set(state => ({
          history: [item, ...state.history].slice(0, 50),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      removeFromHistory: (id) => {
        set(state => ({
          history: state.history.filter(item => item.id !== id),
        }));
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setCurrentImage: (image) => {
        set({ currentImage: image });
      },

      setGenerating: (generating) => {
        set({ isGenerating: generating });
      },

      reset: () => {
        set({
          currentImage: null,
          isGenerating: false,
          settings: defaultSettings,
        });
      },
    }),
    {
      name: 'ai-studio-storage',
    }
  )
);
