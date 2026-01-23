const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export default {
  apiUrl: API_URL,
  supportedEngines: [
    { id: 'doubao', name: '豆包', provider: '字节跳动', type: 'paid' },
    { id: 'gemini', name: 'Google Gemini', provider: 'Google', type: 'paid' },
    { id: 'openai', name: 'OpenAI DALL-E', provider: 'OpenAI', type: 'paid' },
    { id: 'baidu', name: '百度文心', provider: '百度', type: 'paid' },
    { id: 'ali', name: '阿里通义', provider: '阿里云', type: 'paid' },
    { id: 'xunfei', name: '讯飞星火', provider: '讯飞', type: 'paid' },
    { id: 'tencent', name: '腾讯混元', provider: '腾讯', type: 'paid' },
    { id: 'midjourney', name: 'Midjourney', provider: 'Discord', type: 'paid' },
    { id: 'stability', name: 'Stability AI', provider: 'Stability', type: 'paid' },
  ],
};

