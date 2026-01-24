/**
 * AI Studio - 调试工具（开发环境专用）
 * 此文件用于开发环境调试，部署时会自动跳过
 */

// 开发环境检查
const isDevelopment = import.meta.env?.DEV || process.env.NODE_ENV === 'development'

if (isDevelopment) {
  console.log('%c AI Studio 开发模式已启用 ', 'background: #1890ff; color: white; padding: 4px 8px; border-radius: 4px;')
  console.log('%c 按 F12 打开浏览器控制台查看调试信息 ', 'background: #52c41a; color: white; padding: 4px 8px; border-radius: 4px;')
  
  // 暴露全局调试函数
  (window as any).aiStudioDebug = {
    version: '1.0.0',
    environment: 'development',
    getState: () => {
      console.log('AI Studio 调试工具可用')
      return { status: 'ready' }
    }
  }
}

