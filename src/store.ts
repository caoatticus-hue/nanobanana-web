import { create } from 'zustand'

interface AIStore {
  generationMode: 'cloud' | 'local'
  setGenerationMode: (mode: 'cloud' | 'local') => void
  
  localModelStatus: 'unloaded' | 'loading' | 'ready' | 'error'
  setLocalModelStatus: (status: 'unloaded' | 'loading' | 'ready' | 'error') => void
  
  localModelProgress: number
  setLocalModelProgress: (progress: number) => void
  
  localModelCacheSize: string
  setLocalModelCacheSize: (size: string) => void
  
  webgpuSupported: boolean
  setWebgpuSupported: (supported: boolean) => void
}

export const useStore = create<AIStore>((set) => ({
  generationMode: 'cloud',
  setGenerationMode: (mode) => set({ generationMode: mode }),
  
  localModelStatus: 'unloaded',
  setLocalModelStatus: (status) => set({ localModelStatus: status }),
  
  localModelProgress: 0,
  setLocalModelProgress: (progress) => set({ localModelProgress: progress }),
  
  localModelCacheSize: '0 MB',
  setLocalModelCacheSize: (size) => set({ localModelCacheSize: size }),
  
  webgpuSupported: false,
  setWebgpuSupported: (supported) => set({ webgpuSupported: supported })
}))
