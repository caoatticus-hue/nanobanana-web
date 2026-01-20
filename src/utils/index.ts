// 格式化时间
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString('zh-CN', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit' 
  });
};

// 截取文本（用于标题）
export const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 生成唯一ID
export const generateId = (): string => {
  return crypto.randomUUID();
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// 延迟函数
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 检查是否是中文
export const isChinese = (text: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(text);
};

// 获取模型显示名称
export const getModelDisplayName = (modelId: string): string => {
  const models: Record<string, string> = {
    'qwen-turbo': '通义千问 Turbo',
    'qwen-plus': '通义千问 Plus',
    'qwen-max': '通义千问 Max',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'gpt-4': 'GPT-4',
    'claude-3-haiku': 'Claude 3 Haiku',
    'claude-3-sonnet': 'Claude 3 Sonnet',
    'claude-3-opus': 'Claude 3 Opus',
  };
  
  return models[modelId] || modelId;
};

// 计算Token使用量（估算）
export const estimateTokens = (text: string): number => {
  // 中文约等于1.5个token，英文约等于4个字符1个token
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + otherChars / 4);
};

