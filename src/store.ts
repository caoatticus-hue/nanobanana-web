import { create } from 'zustand';

interface AppState {
  mode: 'image' | 'video' | 'ppt' | 'paper';
  setMode: (mode: 'image' | 'video' | 'ppt' | 'paper') => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'image',
  setMode: (mode) => set({ mode }),
}));
