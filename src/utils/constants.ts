// 提示词建议
export const suggestions = [
  '一座未来主义城市，赛博朋克风格，霓虹灯光',
  '可爱的3D手办角色，写实风格',
  '风景画，日落时分，金色光芒',
  '抽象艺术，色彩鲜艳，几何形状',
];

// 宽高比显示名称
export const aspectRatioLabels: Record<string, string> = {
  '1:1': '正方形',
  '16:9': '横屏',
  '9:16': '竖屏',
  '4:3': '标准4:3',
  '3:4': '标准3:4',
};

// 引擎显示名称
export const engineNames: Record<string, string> = {
  'doubao': '豆包',
  'gemini': 'Google Gemini',
  'openai': 'OpenAI DALL-E',
  'baidu': '百度文心',
  'ali': '阿里通义',
  'xunfei': '讯飞星火',
  'tencent': '腾讯混元',
  'midjourney': 'Midjourney',
  'stability': 'Stability AI',
  'local': '本地AI',
};
