let pipelineInstance: any = null

export const LocalAIService = {
  task: 'image-generation',
  model: 'Xenova/stable-diffusion-2-1-base',
  
  async getPipeline() {
    if (pipelineInstance) {
      return pipelineInstance
    }
    const transformers = await import('@xenova/transformers')
    pipelineInstance = await transformers.pipeline('image-generation', this.model)
    return pipelineInstance
  },
  
  async generate(prompt: string, options?: { width?: number; height?: number }) {
    const pipeline = await this.getPipeline()
    const output = await pipeline(prompt, {
      width: options?.width || 512,
      height: options?.height || 512,
    })
    return output[0]
  },
  
  reset() {
    pipelineInstance = null
  }
}

export default LocalAIService
