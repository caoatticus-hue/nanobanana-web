import { useState } from 'react'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [imageCount, setImageCount] = useState(1)

  const aspectRatios = [
    { value: '1:1', label: '正方形', width: 1024, height: 1024 },
    { value: '16:9', label: '宽屏', width: 1280, height: 720 },
    { value: '9:16', label: '竖屏', width: 720, height: 1280 },
  ]

  const suggestions = [
    '梦幻星空下的城堡',
    '赛博朋克城市夜景',
    '可爱猫咪在草地上',
    '未来科技风格汽车',
  ]

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('请输入描述词')
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
        throw new Error('生成失败，请重试')
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      const newImages: string[] = []
      for (let i = 0; i < imageCount; i++) {
        newImages.push(objectUrl)
      }
      
      setGeneratedImages(prev => [...newImages, ...prev])
      setProgress(100)
      setStatus('生成完成！')
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : '生成失败，请重试')
      setStatus('')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="main-content">
      <div className="card animate-fade-in">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          AI 绘画
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            className="input"
            placeholder="描述你想要生成的图片..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        {prompt && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
              试试这些创意
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {suggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className="tag"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="tabs">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.value}
              className={`tab ${aspectRatio === ratio.value ? 'active' : ''}`}
              onClick={() => setAspectRatio(ratio.value)}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
            生成张数
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 4].map((count) => (
              <button
                key={count}
                className={`tab ${imageCount === count ? 'active' : ''}`}
                onClick={() => setImageCount(count)}
                style={{ flex: 'none', padding: '10px 20px' }}
              >
                {count}张
              </button>
            ))}
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
          <span>{isGenerating ? '生成中...' : '开始生成'}</span>
        </button>
      </div>

      {generatedImages.length > 0 && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title">生成的图片</h3>
          </div>
          <div className="image-grid">
            {generatedImages.map((url, index) => (
              <div key={index} className="image-item">
                <img src={url} alt={`生成的图像 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedImages.length === 0 && !isGenerating && (
        <div className="card animate-fade-in">
          <div className="empty-state">
            <div className="empty-icon">🏔️</div>
            <p className="empty-title">准备好开始创作了吗？</p>
            <p className="empty-desc">输入描述词，让AI为你创作独一无二的图片</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGenerator
