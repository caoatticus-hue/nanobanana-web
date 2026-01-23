import { useState } from 'react'

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([])
  const [frameCount, setFrameCount] = useState(8)

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
      const ratio = { width: 512, height: 512 }

      for (let i = 0; i < frameCount; i++) {
        const encodedPrompt = encodeURIComponent(`${prompt}, frame ${i + 1}`)
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
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">视频生成</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            描述视频内容
          </label>
          <textarea
            className="input"
            placeholder="描述您想要的视频..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            帧数：{frameCount}
          </label>
          <input
            type="range"
            min="4"
            max="16"
            value={frameCount}
            onChange={(e) => setFrameCount(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
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
          onClick={generateFrames}
          disabled={isGenerating || !prompt.trim()}
          style={{ width: '100%' }}
        >
          <span>🎬</span>
          <span>生成帧序列</span>
        </button>

        {generatedFrames.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '16px' }}>生成的帧</h3>
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
    </div>
  )
}

export default VideoGenerator
