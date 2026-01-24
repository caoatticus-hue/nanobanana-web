export const generateImage = async (
  prompt: string, 
  mode: 'fast' | 'high', 
  aspectRatio: string
) => {
  // 根据画幅计算尺寸
  const sizeMap: Record<string, {w: number, h: number}> = {
    "1:1": { w: 1024, h: 1024 },
    "16:9": { w: 1280, h: 720 },
    "9:16": { w: 720, h: 1280 },
    "4:3": { w: 1024, h: 768 }
  };
  
  const { w, h } = sizeMap[aspectRatio] || sizeMap["1:1"];
  const seed = Date.now();
  
  // 模式切换逻辑
  const model = mode === 'fast' ? 'turbo' : 'flux';
  const enhance = mode === 'high' ? 'true' : 'false';

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&model=${model}&nologo=true&enhance=${enhance}`;
  
  return imageUrl;
};
