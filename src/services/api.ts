import { ChatRequest, ChatResponse, AIModel } from '../types';
import config from '../config';

const API_URL = config.alibabaBackendUrl;

export const api = {
  // 发送聊天请求
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || '请求失败');
    }

    return response.json();
  },

  // 获取可用模型列表
  async getModels(): Promise<AIModel[]> {
    const response = await fetch(`${API_URL}/api/models`);
    
    if (!response.ok) {
      throw new Error('获取模型列表失败');
    }

    return response.json();
  },

  // 文本转语音
  async textToSpeech(text: string, voice: string = 'xiaoyun'): Promise<Blob> {
    const response = await fetch(`${API_URL}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      throw new Error('语音合成失败');
    }

    return response.blob();
  },

  // 图像生成
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<{ url: string }> {
    const response = await fetch(`${API_URL}/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, size }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '图像生成失败' }));
      throw new Error(error.message || '图像生成失败');
    }

    return response.json();
  },
};

export default api;

