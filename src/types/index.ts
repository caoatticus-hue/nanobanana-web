// 引擎类型
export type EngineType = 
  | 'doubao'
  | 'gemini'
  | 'openai'
  | 'baidu'
  | 'ali'
  | 'xunfei'
  | 'tencent'
  | 'midjourney'
  | 'stability'
  | 'local';

// 宽高比类型
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

// 引擎配置
export interface EngineConfig {
  id: EngineType;
  name: string;
  provider: string;
  icon: string;
  region: '国内' | '国际' | '本地';
  type: 'paid' | 'free' | 'local';
}

// 图片生成请求
export interface GenerateRequest {
  prompt: string;
  engine: EngineType;
  aspectRatio: AspectRatio;
  imageCount: number;
  referenceImage?: string;
}

// 图片生成响应
export interface GenerateResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

// 生成历史记录
export interface GenerationHistory {
  id: string;
  prompt: string;
  imageData: string;
  engine: EngineType;
  aspectRatio: AspectRatio;
  timestamp: number;
}

// 组件 Props 类型
export interface ImageGeneratorProps {
  engine: string;
  onBack: () => void;
}

// 用户设置
export interface UserSettings {
  defaultEngine: string;
  defaultAspectRatio: AspectRatio;
  defaultImageCount: number;
  autoSave: boolean;
}

