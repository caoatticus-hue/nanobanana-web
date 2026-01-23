import { GenerateRequest, GenerateResponse } from '../types';
import config from '../config';

const API_URL = config.apiUrl;

export const imageApi = {
  // 生成图片
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '生成失败' }));
      return { success: false, error: error.message };
    }

    return response.json();
  },

  // 健康检查
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}/api/health`);
    return response.json();
  },

  // 获取可用引擎
  async getEngines(): Promise<Array<{ id: string; name: string }>> {
    const response = await fetch(`${API_URL}/api/engines`);
    return response.json();
  },
};

export default imageApi;
