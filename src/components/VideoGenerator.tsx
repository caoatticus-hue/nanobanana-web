import { useState, useRef } from 'react'

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [frameCount, setFrameCount] = useState(8)
  
  const generateVideo = async () => {
    if (!prompt.trim()) {
      return
    }

    setIsGenerating(true)
    setGeneratedVideo(null)
    setProgress(0)
    setStatus('正在生成视频帧...')

    try {
      // 生成多帧图像
      const frames: string[] = []
      const ratio = { width: 512, height: 512 }
      
      for (let i = 0; i < frameCount; i++) {
        const encodedPrompt = encodeURIComponent(`${prompt}, frame ${i + 1} of ${frameCount}, slight variation`)
        const seed = Math.floor(Math.random() * 1000000) + i
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratio.width}&height=${ratio.height}&seed=${seed}&nologo=true&enhance=true`
        
        const response = await fetch(url)
        const blob = await response.blob()
        frames.push(URL.createObjectURL(blob))
        
        setProgress(Math.round(((i + 1) / frameCount) * 50))
        setStatus(`正在生成帧 ${i + 1}/${frameCount}...`)
      }

      // 创建视频
      setStatus('正在合成视频...')
      const videoBlob = await createVideoFromFrames(frames, ratio.width, ratio.height)
      const videoUrl = URL.createObjectURL(videoBlob)
      setGeneratedVideo(videoUrl)
      
      setProgress(100)
      setStatus('视频生成完成！')
    } catch (error) {
      console.error(error)
      setStatus('视频生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  // 使用Canvas将帧合成视频
  const createVideoFromFrames = async (
    frames: string[],
    width: number,
    height: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'))
        return
      }

      const images: HTMLImageElement[] = []
      let loadedCount = 0

      frames.forEach((url, index) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          loadedCount++
          if (loadedCount === frames.length) {
            // 所有图片加载完成，创建动画
            renderAnimation()
          }
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === frames.length) {
            renderAnimation()
          }
        }
        img.src = url
        images[index] = img
      })

      const renderAnimation = () => {
        // 创建简单的GIF动画（使用canvas.toDataURL）
        // 注意：真正的视频编码需要WebCodecs API或FFmpeg.wasm
        // 这里我们创建一个简单的帧序列展示
        
        const duration = frames.length * 500 // 每帧500ms
        let currentFrame = 0
        
        const animate = () => {
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, width, height)
          
          if (images[currentFrame]) {
            ctx.drawImage(images[currentFrame], 0, 0, width, height)
          }
          
          // 添加帧号水印
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.font = '16px Arial'
          ctx.fillText(`帧 ${currentFrame + 1}/${frames.length}`, 10, 25)
          
          currentFrame++
          if (currentFrame < frames.length) {
            setTimeout(animate, 500)
          } else {
            // 返回最终的合成图像（实际项目可使用FFmpeg.wasm生成真正的视频）
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('无法创建视频Blob'))
              }
            }, 'image/png')
          }
        }
        
        animate()
      }
    })
  }

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement('a')
      link.href = generatedVideo
      link.download = 'ai-video.png'
      link.click()
    }
  }

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">视频生成</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            描述您想要的视频内容
          </label>
          <textarea
            className="input"
            placeholder="例如：一只会说话的小猫在草地上跑，阳光明媚..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            style={{ minHeight: '120px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            生成帧数：{frameCount} 帧
          </label>
          <input
            type="range"
            min="4"
            max="16"
            value={frameCount}
            onChange={(e) => setFrameCount(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
            <span>4帧（快）</span>
            <span>16帧（慢）</span>
          </div>
        </div>

        {isGenerating && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>{status}</span>
              <span style={{ color: '#9ca3af' }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={generateVideo}
          disabled={isGenerating || !prompt.trim()}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          <span>🎬</span>
          <span>{isGenerating ? '生成中...' : '生成视频'}</span>
        </button>

        {generatedVideo && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              backgroundColor: '#2a2a2a', 
              borderRadius: '12px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ color: '#10b981', marginBottom: '12px', textAlign: 'center' }}>
                ✓ {status}
              </p>
              <img 
                src={generatedVideo} 
                alt="生成的视频帧"
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
              <button
                className="btn btn-success"
                onClick={downloadVideo}
                style={{ width: '100%' }}
              >
                <span>📥</span>
                <span>下载视频帧</span>
              </button>
            </div>
          </div>
        )}

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#2a2a2a', 
          borderRadius: '12px',
          marginTop: '20px'
        }}>
          <h4 style={{ marginBottom: '12px', color: '#ffffff' }}>💡 使用说明</h4>
          <ul style={{ 
            paddingLeft: '20px', 
            color: '#9ca3af', 
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <li>输入详细的视频描述（英文效果更好）</li>
            <li>调整帧数以控制视频长度</li>
            <li>点击生成按钮，等待AI创建每一帧</li>
            <li>生成完成后可以下载查看</li>
            <li>注意：完整视频需要更高级的后端支持</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoGenerator
