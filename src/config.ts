/**
 * AI Studio - 前端配置
 */

// 当前使用的API地址
export const config = {
  // 是否为开发环境
  isDevelopment: import.meta.env.DEV || window.location.hostname === 'localhost',
  
  // 阿里通义后端API地址
  // 生产环境：使用Vercel后端
  alibabaBackendUrl: import.meta.env.DEV 
    ? '/api/aliyun'  
    : 'https://nanobanana-web.vercel.app',  
  
  // 默认演示API地址
  demoApiUrl: 'https://dashscope.aliyuncs.com/api/v1',
  
  // 网站配置
  siteName: 'AI Studio',
  siteUrl: 'https://nanobanana-web.vercel.app',
  
  // 功能开关
  features: {
    cloudSync: true,
    history: true,
    favorites: true,
  }
};
