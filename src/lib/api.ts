export const generateImage = async (
  prompt: string, 
  mode: 'fast' | 'high', 
  aspectRatio: string
) => {
  const sizeMap: Record<string, {w: number, h: number}> = {
    "1:1": { w: 1024, h: 1024 },
    "16:9": { w: 1280, h: 720 },
    "9:16": { w: 720, h: 1280 },
    "4:3": { w: 1024, h: 768 }
  };
  
  const { w, h } = sizeMap[aspectRatio] || sizeMap["1:1"];
  const seed = Math.floor(Math.random() * 1000000);
  const model = mode === 'fast' ? 'turbo' : 'flux';

  // 这里的 URL 是直接生成的图片流
  return `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&model=${model}&nologo=true`;
};
