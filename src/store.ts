import { create } from 'zustand';

interface AppState {
  mode: 'image' | 'video' | 'ppt' | 'paper';
  setMode: (mode: 'image' | 'video' | 'ppt' | 'paper') => void;
  // 以下是补全旧代码需要的属性，防止 Settings.tsx 报错
  generationMode: string;
  setGenerationMode: (mode: string) => void;
  webgpuSupported: boolean;
  setWebgpuSupported: (supported: boolean) => void;
  setLocalModelStatus: (status: string) => void;
  setLocalModelCacheSize: (size: string) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'image',
  setMode: (mode) => set({ mode }),
  generationMode: 'cloud',
  setGenerationMode: () => {},
  webgpuSupported: false,
  setWebgpuSupported: () => {},
  setLocalModelStatus: () => {},
  setLocalModelCacheSize: () => {},
}));
