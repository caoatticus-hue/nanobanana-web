import { useEffect } from 'react'
import { useStore } from '../store'

const Settings = () => {
  const { 
    generationMode, 
    setGenerationMode,
    webgpuSupported,
    setWebgpuSupported,
    setLocalModelStatus,
    setLocalModelCacheSize
  } = useStore()

  useEffect(() => {
    const checkWebGPU = async () => {
      if (typeof navigator !== 'undefined' && (navigator as any).gpu) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter()
          if (adapter) {
            setWebgpuSupported(true)
          } else {
            setWebgpuSupported(false)
          }
        } catch {
          setWebgpuSupported(false)
        }
      } else {
        setWebgpuSupported(false)
      }
    }
    checkWebGPU()
  }, [setWebgpuSupported])

  const downloadModel = () => {
    setLocalModelStatus('loading')
    setTimeout(() => {
      setLocalModelStatus('ready')
    }, 2000)
  }

  const clearCache = () => {
    setLocalModelCacheSize('0 MB')
    setLocalModelStatus('unloaded')
  }

  return (
    <div className="main-content">
      <div className="card animate-fade-in">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
          系统设置
        </h2>

        <div className="tabs" style={{ marginBottom: '24px' }}>
          <button className="tab active">通用</button>
          <button className="tab">引擎管理</button>
          <button className="tab">关于</button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>AI生成引擎</h3>
          
          <div 
            className="card"
            style={{ 
              cursor: 'pointer',
              border: generationMode === 'cloud' ? '2px solid #7c83fd' : '1px solid rgba(255,255,255,0.08)',
              background: generationMode === 'cloud' ? 'rgba(124, 131, 253, 0.1)' : 'rgba(40, 40, 45, 0.4)',
              padding: '20px',
              marginBottom: '12px'
            }}
            onClick={() => setGenerationMode('cloud')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #7c83fd 0%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ☁️
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>在线模式</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Pollinations AI - 完全免费</p>
              </div>
            </div>
          </div>

          <div 
            className="card"
            style={{ 
              cursor: webgpuSupported ? 'pointer' : 'not-allowed',
              border: generationMode === 'local' ? '2px solid #7c83fd' : '1px solid rgba(255,255,255,0.08)',
              background: generationMode === 'local' ? 'rgba(124, 131, 253, 0.1)' : 'rgba(40, 40, 45, 0.4)',
              opacity: webgpuSupported ? 1 : 0.5,
              padding: '20px'
            }}
            onClick={() => webgpuSupported && setGenerationMode('local')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🖥️
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>本地模式</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  {webgpuSupported ? 'Transformers.js - 离线可用' : '需要WebGPU支持'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>模型状态</h3>
          
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>WebGPU</span>
              <span className={`tag ${webgpuSupported ? 'active' : ''}`}>
                {webgpuSupported ? '✓ 支持' : '✗ 不支持'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>模型缓存</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>0 MB</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={downloadModel} style={{ flex: 1 }}>
            <span>📥</span>
            <span>下载模型</span>
          </button>
          <button className="btn btn-secondary" onClick={clearCache} style={{ flex: 1 }}>
            <span>🗑️</span>
            <span>清除缓存</span>
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
        AI Studio v2.0
      </p>
    </div>
  )
}

export default Settings
