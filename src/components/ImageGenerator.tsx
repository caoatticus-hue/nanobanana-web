import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'

// 声明Transformers.js
declare const import: any

const ImageGenerator = () => {
  const { 
    generationMode,
    localModelStatus,
    setLocalModelStatus,
    setLocalModelProgress
  } = useStore()
  
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [imageCount, setImageCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // 本地模型pipeline
  const pipelineRef = useRef<any>(null)

  const aspectRatios = [
    { value: '1:1', label: '1:1 (正方形)', width: 1024, height: 1024 },
    { value: '16:9', label: '16:9 (宽屏)', width: 1280, height: 720 },
    { value: '9:16', label: '9:16 (竖屏)', width: 720, height: 1280 },
    { value: '4:3', label: '4:3 (标准)', width: 1024, height: 768 },
    { value: '3:4', label: '3:4 (竖版)', width: 768, height: 1024 },
  ]

  // 加载Transformers.js
  useEffect(() => {
    if (generationMode === 'local' && localModelStatus === 'unloaded') {
      loadTransformers()
    }
  }, [generationMode, localModelStatus])

  const loadTransformers = async () => {
    try {
      setLocalModelStatus('loading')
      setStatus('正在加载模型库...')
      setProgress(10)
      
      // 动态导入Transformers.js
      try {
        const transformers = await import('@xenova/transformers')
        setProgress(30)
        setStatus('正在初始化模型...')
        
        // 加载本地扩散模型
        pipelineRef.current = await transformers.pipeline('image-generation', 'Xenova/stable-diffusion-fast', {
          progress_callback: (data: any) => {
            if (data.status === 'progress') {
              setLocalModelProgress(data.progress)
            }
          }
        })
        
        setProgress(100)
        setLocalModelStatus('ready')
        setStatus('')
      } catch (importError: any) {
        console.error('导入Transformers.js失败:', importError)
        setLocalModelStatus('error')
        setError(`加载失败: ${importError.message || '请检查网络连接后重试'}`)
      }
    } catch (err: any) {
      console.error('加载Transformers.js失败:', err)
      setLocalModelStatus('error')
      setError(`加载失败: ${err.message}`)
    }
  }

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }

    setError('')
    setIsGenerating(true)
    setProgress(0)
    abortControllerRef.current = new AbortController()

    try {
      if (generationMode === 'cloud') {
        await generateWithCloud()
      } else {
        await generateWithLocal()
      }
    } catch (err: any) {
      console.error('生成错误:', err)
      if (!err.message?.includes('AbortError')) {
        setError(err.message || '图像生成失败，请重试')
        setStatus('')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // 使用Pollinations AI在线生成
  const generateWithCloud = async () => {
    setStatus('正在连接Pollinations AI...')
    setProgress(10)

    const ratio = aspectRatios.find(r => r.value === aspectRatio)
    const encodedPrompt = encodeURIComponent(prompt)
    const seed = Math.floor(Math.random() * 1000000)
    
    // Pollinations AI URL格式
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratio?.width}&height=${ratio?.height}&seed=${seed}&nologo=true&enhance=true`

    setProgress(30)
    setStatus('正在生成图像...')

    try {
      // 验证URL是否可访问
      const response = await fetch(url, { 
        mode: 'cors',
        signal: abortControllerRef.current?.signal
      })
      
      if (!response.ok) {
        throw new Error(`网络错误: ${response.status}`)
      }

      setProgress(80)
      
      // 将响应转换为blob
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      // 生成多张图像
      const newImages: string[] = []
      for (let i = 0; i < imageCount; i++) {
        newImages.push(objectUrl)
      }
      
      setGeneratedImages(prev => [...prev, ...newImages])
      setStatus('图像生成完成!')
      setProgress(100)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err
      }
      
      console.error('Fetch error:', err)
      setError('由于网络限制，图像生成可能受到影响。请尝试切换到本地模式。')
      setStatus('')
    }
  }

  // 使用本地AI生成
  const generateWithLocal = async () => {
    if (!pipelineRef.current) {
      if (localModelStatus === 'error') {
        throw new Error('本地模型加载失败，请检查设置')
      }
      throw new Error('本地模型未加载，请先在设置中下载模型')
    }

    setStatus('正在本地推理中...')
    setProgress(10)

    const ratio = aspectRatios.find(r => r.value === aspectRatio)
    const width = ratio?.width || 512
    const height = ratio?.height || 512

    // 限制本地生成的尺寸（浏览器性能
