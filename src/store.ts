import { create } from 'zustand'

interface AIStore {
  // 生成模式：cloud（在线免费API）或 local（本地AI）
  generationMode: 'cloud' | 'local'
  setGenerationMode: (mode: 'cloud' | 'local') => void
  
  // 本地模型状态
  localModelStatus: 'unloaded' | 'loading' | 'ready' | 'error'
  setLocalModelStatus: (status: 'unloaded' | 'loading' | 'ready' | 'error') => void
  
  // 模型下载进度 (0-100)
  localModelProgress: number
  setLocalModelProgress: (progress: number) => void
  
  // 本地模型缓存大小
  localModelCacheSize: string
  setLocalModelCacheSize: (size: string) => void
  
  // WebGPU支持状态
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

