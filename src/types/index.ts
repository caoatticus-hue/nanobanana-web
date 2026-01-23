export interface ImageGenerationRequest {
  prompt: string
  negative_prompt?: string
  size?: string
  n?: number
}

export type AspectRatio = '1:1' | '16:9' | '9:16'
