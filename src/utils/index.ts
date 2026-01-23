// 格式化时间
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 获取宽高比数值
export const getAspectRatioValues = (ratio: string): { width: number; height: number } => {
  const ratios: Record<string, { width: number; height: number }> = {
    '1:1': { width: 512, height: 512 },
    '16:9': { width: 682, height: 384 },
    '9:16': { width: 384, height: 682 },
    '4:3': { width: 512, height: 384 },
    '3:4': { width: 384, height: 512 },
  };
  return ratios[ratio] || ratios['1:1'];
};

