import { useEffect } from 'react'
import { useStore } from '../store'

const Settings = () => {
  const { 
    generationMode, 
    setGenerationMode,
    webgpuSupported,
    setWebgpuSupported,
    localModelStatus,
    setLocalModelStatus,
    localModelProgress,
    setLocalModelProgress,
    localModelCacheSize,
    setLocalModelCacheSize
  } = useStore()

  // 检测WebGPU支持
  useEffect(() => {
    const checkWebGPU = async () => {
      if (!navigator.gpu) {
        setWebgpuSupported(false)
        return
      }
      
      try {
        const adapter = await navigator.gpu.requestAdapter()
        if (adapter) {
          setWebgpuSupported(true)
          // 获取缓存大小
          if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate()
            const size = estimate.usage ? formatBytes(estimate.usage) : '0 MB'
            setLocalModelCacheSize(size)
          }
        } else {
          setWebgpuSupported(false)
        }
      } catch (error) {
        console.error('WebGPU检测失败:', error)
        setWebgpuSupported(false)
      }
    }

    checkWebGPU()
  }, [setWebgpuSupported, setLocalModelCacheSize])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadModel = () => {
    setLocalModelStatus('loading')
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setLocalModelStatus('ready')
      }
      setLocalModelProgress(progress)
    }, 500)
  }

  const clearModelCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(cache => caches.delete(cache)))
      setLocalModelCacheSize('0 MB')
      setLocalModelStatus('unloaded')
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 标题区域 */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            系统设置
          </h1>
          <p style={{ color: '#9ca3af' }}>
            选择AI生成模式：在线免费API或本地部署
          </p>
        </div>

        {/* 生成模式选择 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 className="card-title">🤖 AI生成引擎</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* 在线模式 */}
            <div 
              className="card"
              style={{ 
                cursor: 'pointer',
                border: generationMode === 'cloud' ? '2px solid #3b82f6' : '1px solid #2e2e2e',
                backgroundColor: generationMode === 'cloud' ? 'rgba(59, 130, 246, 0.1)' : '#1a1a1a',
                transition: 'all 0.3s ease',
                padding: '24px'
              }}
              onClick={() => setGenerationMode('cloud')}
            >
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>☁️</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#ffffff' }}>
                  ☁️ 在线模式
                </h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
                  使用免费Pollinations AI API
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="tag active">✓ 完全免费</span>
                  <span className="tag">✓ 无需配置</span>
                  <span className="tag">✓ 快速生成</span>
                  <span className="tag">✓ 支持图像和视频</span>
                </div>
              </div>
            </div>

            {/* 本地模式 */}
            <div 
              className="card"
              style={{ 
                cursor: webgpuSupported ? 'pointer' : 'not-allowed',
                border: generationMode === 'local' ? '2px solid #10b981' : '1px solid #2e2e2e',
                backgroundColor: generationMode === 'local' ? 'rgba(16, 185, 129, 0.1)' : '#1a1a1a',
                opacity: webgpuSupported ? 1 : 0.6,
                transition: 'all 0.3s ease',
                padding: '24px'
              }}
              onClick={() => webgpuSupported && setGenerationMode('local')}
            >
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖥️</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#ff
