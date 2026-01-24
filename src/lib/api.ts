/**
 * AI Studio 免登录、全免费 API 方案 (优化版)
 */

export const generateImage = async (prompt: string) => {
  // 设置图片参数
  const width = 1024;
  const height = 1024;
  // 使用当前时间戳作为 seed，确保每一张图都是唯一的
  const seed = Date.now(); 
  const model = 'flux'; 

  // 对提示词进行编码
  const encodedPrompt = encodeURIComponent(prompt);
  
  // 构造生成 URL
  // 添加 cache=false 强制刷新，防止浏览器读取旧的出错缓存
  const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=true`;

  // 这里的策略改为：直接返回 URL，让 App.tsx 的 <img> 标签去加载
  // 这样可以避开 fetch 产生的网络跨域拦截问题
  return imageUrl;
};

/**
 * 视频生成接口 (预留)
 */
export const generateVideo = async (prompt: string) => {
  console.log("Video prompt:", prompt);
  throw new Error("视频模块正在接入中");
};
