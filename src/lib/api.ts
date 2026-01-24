/**
 * AI Studio 免登录、全免费 API 方案
 */

export const generateImage = async (prompt: string) => {
  const width = 1024;
  const height = 1024;
  const seed = Math.floor(Math.random() * 100000);
  const model = 'flux';

  // 正确使用了 prompt 变量
  const encodedPrompt = encodeURIComponent(prompt);
  
  const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=true`;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("生成服务暂不可用");
    return imageUrl;
  } catch (error) {
    console.error("生成失败:", error);
    throw new Error("生成失败，请检查网络连接");
  }
};

/**
 * 视频生成接口 (预留)
 */
export const generateVideo = async (prompt: string) => {
  console.log("正在准备生成视频:", prompt);
  throw new Error("视频模块正在接入中");
};
