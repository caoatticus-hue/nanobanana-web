export interface ImageGenerationRequest {
  prompt: string
  negative_prompt?: string
  size?: string
  n?: number
  guidance_scale?: number
}

export interface VideoGenerationRequest {
  prompt: string
  negative_prompt?: string
  duration?: number
  fps?: number
}

export interface GenerationResponse {
  data: Array<{
    url?: string
    b64_json?: string
  }>
  created?: number
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4'

export interface AspectRatioOption {
  value: AspectRatio
  label: string
  width: number
  height: number
}
