import { useState } from 'react'
import { useStore } from '../store'

const VideoGenerator = () => {
  const { generationMode } = useStore()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  // Pollinations AI视频生成（在线模式）
  const generateWithPollinationsVideo = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }

    setError('')
    setIsGenerating(true)
    setProgress(0)
    setStatus('正在连接Pollinations AI视频服务...')

    try {
      const encodedPrompt = encodeURIComponent(prompt)
      const seed = Math.floor(Math.random() * 1000000)
      
      // Pollinations视频API URL
      const url = `https://video.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&fps=24&duration=4&seed=${seed}&nologo=true`

      setProgress(30)
      setStatus('正在生成视频，这可能需要几分钟...')
      setProgress(50)

      // 验证URL
      const response = await fetch(url, { mode: 'cors' })

      if (!response.ok) {
        throw new Error(`网络错误: ${response.status}`)
      }

      setProgress(80)
      
      // 将响应转换为blob
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      setGeneratedVideos([objectUrl])
      setStatus('视频生成完成!')
      setProgress(100)

    } catch (err: any) {
      console.error('视频生成错误:', err)
      
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        setError('由于浏览器安全限制，视频生成功能可能受限。请尝试直接访问生成的视频链接。')
        setStatus('')
      } else {
        setError(err.message || '视频生成失败，请重试')
        setStatus('')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateVideos = async () => {
    if (generationMode === 'local') {
      setError('视频生成功能目前仅在线模式支持。本地视频生成正在开发中...')
      return
    }

    await generateWithPollinationsVideo()
  }

  const downloadVideo = async (url: string, index: number) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `ai-generated-video-${Date.now()}-${index + 1}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      setError('下载失败')
    }
  }

  const clearVideos = () => {
    setGeneratedVideos([])
  }

  return (
    <div className="animate-fade-in">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 标题区域 */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            AI视频生成
          </h1>
          <p style={{ color: '#9ca3af' }}>
            将静态提示词转化为生动的AI视频内容
          </p>
        </div>

        {/* 本地模式警告 */}
        {generationMode === 'local' && (
          <div style={{ 
            marginBottom: '24px', 
            padding: '20px', 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid #f59e0b',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>🚧</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px' }}>
                  本地模式暂不支持视频生成
                </h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.8' }}>
                  视频生成需要较大的计算资源，目前仅在线模式支持。
                  请切换到"在线模式"以使用视频生成功能，或等待后续更新。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 主要操作区 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* 左侧：提示词输入 */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🎬 视频描述</h2>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                视频提示词 *
              </label>
              <textarea
                className="input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您想要的视频内容，例如：一只小鸟在天空中自由飞翔，背景是蓝天白云..."
                rows={4}
              />
            </div>

            <div style={{ 
              padding: '16px', 
              backgroundColor: '#2a2a2a', 
              borderRadius: '12px', 
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#3b82
