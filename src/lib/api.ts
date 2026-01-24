/**
 * AI Studio 免登录、全免费 API 方案
 * 采用 Pollinations AI，适合在无法注册 Hugging Face 的情况下使用
 */

export const generateImage = async (prompt: string) => {
  // 设置图片参数
  const width = 1024;
  const height = 1024;
  const seed = Math.floor(Math.random() * 100000); // 随机种子让每次生成的图都不一样
  const model = 'flux'; // 使用目前最顶级的 Flux 模型

  // 对中文或特殊字符进行编码，防止请求出错
  const encodedPrompt = encodeURIComponent(prompt);
  
  // 构造生成 URL
  // nologo=true 去除水印，enhance=true 自动优化提示词
  const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=true`;

  try {
    // 预检一下链接是否可用
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("生成服务暂不可用");
    
    // 直接返回这个 URL 即可，前端 <img> 标签可以直接渲染
    return imageUrl;
  } catch (error) {
    console.error("生成失败:", error);
    throw new Error("生成失败，请检查网络连接");
  }
};

/**
 * 视频生成接口 (未来规划)
 */
export const generateVideo = async (prompt: string) => {
  // 目前 Pollinations 对视频的支持还在 Beta 阶段
  // 暂时返回错误，等图片功能稳了我们再接入
  throw new Error("视频模块正在接入中，目前请先使用生图功能");
};
0
