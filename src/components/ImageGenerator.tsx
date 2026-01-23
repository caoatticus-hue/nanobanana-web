import { useState } from 'react'
import { useStore } from '../store'

const ImageGenerator = () => {
  const { generationMode } = useStore()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')

  const aspectRatios = [
    { value: '1:1', width: 1024, height: 1024 },
    { value: '16:9', width: 1280, height: 720 },
    { value: '9:16', width: 720, height: 1280 },
  ]

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }

    setError('')
    setIsGenerating(true)
    setProgress(0)
    setStatus('正在连接服务...')

    try {
      const ratio = aspectRatios.find(r => r.value === aspectRatio)
      const encodedPrompt = encodeURIComponent(prompt)
      const seed = Math.floor(Math.random() * 1000000)
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratio?.width}&height=${ratio?.height}&seed=${seed}&nologo=true&enhance=true`

      setStatus('正在生成图像...')
      setProgress(50)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('生成失败')
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      setGeneratedImages(prev => [objectUrl, ...prev])
      
      setProgress(100)
      setStatus('生成完成！')
    } catch (err: any) {
      console.error(err)
      setError(err.message || '生成失败，请重试')
      setStatus('')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">图像生成</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            输入提示词
          </label>
          <textarea
            className="input"
            placeholder="描述您想要的图像..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            画面比例
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                className={`tab ${aspectRatio === ratio.value ? 'active' : ''}`}
                onClick={() => setAspectRatio(ratio.value)}
                style={{ flex: 1 }}
              >
                {ratio.value}
              </button>
            ))}
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

        {error && (
          <div className="status error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={generateImages}
          disabled={isGenerating || !prompt.trim()}
          style={{ width: '100%' }}
        >
          <span>✨</span>
          <span>{isGenerating ? '生成中...' : '生成图像'}</span>
        </button>

        {generatedImages.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#ffffff' }}>生成的图像</h3>
            <div className="image-grid">
              {generatedImages.map((url, index) => (
                <div key={index} className="image-item">
                  <img src={url} alt={`生成的图像 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGenerator
