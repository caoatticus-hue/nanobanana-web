import { useState } from 'react'

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([])
  const [duration, setDuration] = useState(5)
  const [resolution, setResolution] = useState('720p')
  const [motion, setMotion] = useState(3)

  const generateFrames = async () => {
    if (!prompt.trim()) {
      return
    }

    setIsGenerating(true)
    setGeneratedFrames([])
    setProgress(0)
    setStatus('开始生成...')

    try {
      const frames: string[] = []
      const frameCount = duration * 2 // 每秒2帧
      const ratio = { width: resolution === '1080p' ? 1920 : 1280, height: resolution === '1080p' ? 1080 : 720 }

      for (let i = 0; i < frameCount; i++) {
        const encodedPrompt = encodeURIComponent(`${prompt}, frame ${i + 1} of ${frameCount}`)
        const seed = Math.floor(Math.random() * 1000000) + i
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratio.width}&height=${ratio.height}&seed=${seed}&nologo=true&enhance=true`

        const response = await fetch(url)
        const blob = await response.blob()
        frames.push(URL.createObjectURL(blob))

        setProgress(Math.round(((i + 1) / frameCount) * 100))
        setStatus(`生成帧 ${i + 1}/${frameCount}`)
      }

      setGeneratedFrames(frames)
      setStatus('生成完成！')
    } catch (error) {
      console.error(error)
      setStatus('生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="main-content">
      <div className="card animate-fade-in">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          AI 视频生成
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            className="input"
            placeholder="描述你想要生成的视频..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              时长（秒）
            </label>
            <div style={{ display: 'flex', gap: '6px' }}
            >
              {[3, 5, 10].map((d) => (
                <button
                  key={d}
                  className={`tab ${duration === d ? 'active' : ''}`}
                  onClick={() => setDuration(d)}
                  style={{ flex: 1, padding: '12px' }}
                >
                  {d}秒
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              分辨率
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['720p', '1080p'].map((r) => (
                <button
                  key={r}
                  className={`tab ${resolution === r ? 'active' : ''}`}
                  onClick={() => setResolution(r)}
                  style={{ flex: 1, padding: '12px' }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
            运动强度：{motion}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={motion}
            onChange={(e) => setMotion(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#7c83fd' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            <span>静止</span>
            <span>剧烈</span>
          </div>
        </div>

        {isGenerating && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{status}</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={generateFrames}
          disabled={isGenerating || !prompt.trim()}
          style={{ width: '100%' }}
        >
          <span>🎬</span>
          <span>{isGenerating ? '生成中...' : '开始生成视频'}</span>
        </button>
      </div>

      {generatedFrames.length > 0 && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title">生成的帧序列</h3>
          </div>
          <div className="image-grid">
            {generatedFrames.map((url, index) => (
              <div key={index} className="image-item">
                <img src={url} alt={`帧 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoGenerator
