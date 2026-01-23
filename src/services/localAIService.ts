// Transformers.js 单例服务
// 负责管理本地AI模型的加载和推理

let pipelineInstance: any = null

export const LocalAIService = {
  // 任务类型
  task: 'image-generation' as const,
  
  // 模型名称
  model: 'Xenova/stable-diffusion-2-1-base',
  
  // 获取pipeline实例（单例模式）
  async getPipeline() {
    if (pipelineInstance) {
      return pipelineInstance
    }
    
    // 动态导入Transformers.js
    const transformers = await import('@xenova/transformers')
    
    // 创建pipeline
    pipelineInstance = await transformers.pipeline(this.task, this.model)
    
    return pipelineInstance
  },
  
  // 生成图像
  async generate(prompt: string, options?: {
    width?: number
    height?: number
    negative_prompt?: string
    num_inference_steps?: number
    guidance_scale?: number
  }) {
    const pipeline = await this.getPipeline()
    
    const defaultOptions = {
      width: 512,
      height: 512,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    // 生成图像
    const output = await pipeline(prompt, {
      width: mergedOptions.width,
      height: mergedOptions.height,
      negative_prompt: mergedOptions.negative_prompt,
      guidance_scale: mergedOptions.guidance_scale,
      num_inference_steps: mergedOptions.num_inference_steps,
    })
    
    // 转换为base64
    const imageBlob = output[0]
    const base64 = await this.blobToBase64(imageBlob)
    
    return base64
  },
  
  // Blob转Base64
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  },
  
  // 重置实例
  reset() {
    pipelineInstance = null
  }
}

export default LocalAIService
