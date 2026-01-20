/**
 * AI Studio - 多引擎AI绘画平台 - 类型定义
 */

// ============================================================================
// 引擎类型定义
// ============================================================================

// 支持的AI引擎类型
export type EngineType = 
  | 'gemini'        
  | 'openai'        
  | 'midjourney'    
  | 'doubao'        
  | 'baidu'         
  | 'ali'           
  | 'xunfei'        
  | 'tencent'       
  | 'stability'     
  | 'pollinations'  
  | 'huggingface'   
  | 'replicate-free'
  | 'baidu-free'    
  | 'xunfei-free'   
  | 'civitai'       
  | 'local'         
  | 'nanobanana'    
  | 'geometric'     
  | 'fractal'       
  | 'pixel-art'     
  | 'mandala'       
  | 'mosaic'        
  | 'fluid'         
  | 'particles'     
  | 'cellular'      
  | 'noise-pattern';

// 引擎配置字段类型
export interface EngineCredentialField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'url';
  required: boolean;
  helpText?: string;
}

// 引擎定义
export interface EngineDefinition {
  type: EngineType;
  name: string;
  icon: string;
  description: string;
  color: string;
  primaryCredentialField: Omit<EngineCredentialField, 'helpText'> & { helpText?: string };
  advancedCredentialFields?: EngineCredentialField[];
  defaultModels: string[];
  requiresProxy: boolean;
  region?: string;
  regionName?: string;
  guideUrl?: string;
  guideSteps?: string[];
}

// 引擎配置实例（用户保存的配置）
export interface EngineConfig {
  id: string;
  type: EngineType;
  name: string;
  credentials: Record<string, string>;
  settings: EngineSettings;
  isActive: boolean;
  createdAt: number;
  lastUsedAt?: number;
}

// 引擎特定设置
export interface EngineSettings {
  model: string;
  aspectRatio: AspectRatio;
  quality?: string;
  style?: string;
  seed?: number;
  steps?: number;
  cfgScale?: number;
}

// ============================================================================
// 基础类型定义
// ============================================================================

export interface ApiConfig {
  apiKey: string;
  proxyUrl: string;
  model: string;
}

export interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  imageData?: string;
  config?: GenerationConfig;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  imageData: string;
  timestamp: number;
  config?: GenerationConfig;
  model?: string;
  engineType?: EngineType;
  engineName?: string;
}

// ============================================================================
// 免费API引擎分类
// ============================================================================

export interface FreeEngineDefinition extends EngineDefinition {
  freeLimit: string;
  freeFeatures?: string[];
}

// ============================================================================
// 本地AI引擎类型定义
// ============================================================================

export interface LocalEngineDefinition extends EngineDefinition {
  serverType: 'comfyui' | 'automatic1111' | 'ollama' | 'lmstudio' | 'custom' | 'browser';
  defaultPort: number;
  apiFormat: 'openai' | 'comfyui' | 'custom' | 'none';
  features: string[];
  setupUrl?: string;
}

// 浏览器内置AI引擎定义
export const BROWSER_LOCAL_ENGINES: LocalEngineDefinition[] = [
  {
    type: 'nanobanana',
    name: 'Nanobanana 艺术',
    icon: 'Sparkles',
    description: '独特的抽象艺术图案生成，完全在浏览器中运行',
    color: '#ec4899',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '生成复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['nanobanana-abstract'],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '浏览器内置引擎，无需配置',
      '选择风格和颜色',
      '点击生成即可创作'
    ],
    features: ['完全本地运行', '无需API密钥', '隐私保护', '即时生成'],
    setupUrl: undefined
  },
  {
    type: 'geometric',
    name: '几何图案',
    icon: 'Square',
    description: '精确的几何形状组合生成',
    color: '#3b82f6',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '生成复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['geometric-pattern'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['精确几何形状', '多样化组合', '现代设计感', '快速生成'],
    setupUrl: undefined
  },
  {
    type: 'fractal',
    name: '分形艺术',
    icon: 'Hexagon',
    description: '数学分形图案生成',
    color: '#10b981',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '分形复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['fractal-art'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['数学之美', '无限细节', '独特图案', '艺术创作'],
    setupUrl: undefined
  },
  {
    type: 'pixel-art',
    name: '像素艺术',
    icon: 'Grid',
    description: '复古像素风格生成',
    color: '#f59e0b',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '像素复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['pixel-art'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['复古风格', '像素美学', '怀旧情怀', '游戏素材'],
    setupUrl: undefined
  },
  {
    type: 'mandala',
    name: '曼陀罗',
    icon: 'Circle',
    description: '对称的曼陀罗图案生成',
    color: '#8b5cf6',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '曼陀罗复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['mandala-pattern'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['对称美学', '禅意图案', '冥想艺术', '装饰设计'],
    setupUrl: undefined
  },
  {
    type: 'mosaic',
    name: '马赛克',
    icon: 'Layers',
    description: '马赛克拼贴艺术生成',
    color: '#06b6d4',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '马赛克复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['mosaic-art'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['拼贴艺术', '碎片美学', '现代设计', '装饰图案'],
    setupUrl: undefined
  },
  {
    type: 'fluid',
    name: '流体模拟',
    icon: 'Droplet',
    description: '流体动态效果生成',
    color: '#0ea5e9',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '流体复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['fluid-art'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['流动效果', '液态美学', '梦幻氛围', '抽象艺术'],
    setupUrl: undefined
  },
  {
    type: 'particles',
    name: '粒子系统',
    icon: 'Sparkles',
    description: '粒子聚集图案生成',
    color: '#ef4444',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '粒子复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['particle-pattern'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['粒子效果', '星尘美学', '梦幻光点', '科技感'],
    setupUrl: undefined
  },
  {
    type: 'cellular',
    name: '细胞自动机',
    icon: 'Grid3X3',
    description: '生命游戏图案生成',
    color: '#22c55e',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '自动机复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['cellular-automata'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['生命演化', '自然图案', '数学艺术', '生成艺术'],
    setupUrl: undefined
  },
  {
    type: 'noise-pattern',
    name: '噪声图案',
    icon: 'Waves',
    description: 'Perlin噪声图案生成',
    color: '#a855f7',
    serverType: 'browser',
    defaultPort: 0,
    apiFormat: 'none',
    primaryCredentialField: {
      key: 'complexity',
      label: '复杂度',
      placeholder: '50',
      type: 'text',
      required: false,
      helpText: '噪声复杂度 1-100'
    },
    advancedCredentialFields: [
      {
        key: 'colors',
        label: '颜色配置（JSON数组，可选）',
        placeholder: '["#ff6b6b", "#4ecdc4"]',
        type: 'text',
        required: false,
        helpText: '可选的自定义颜色列表'
      },
      {
        key: 'seed',
        label: '随机种子（可选）',
        placeholder: '自动生成',
        type: 'text',
        required: false,
        helpText: '固定种子可复现结果'
      }
    ],
    defaultModels: ['noise-pattern'],
    requiresProxy: false,
    region: 'local',
    guideSteps: ['浏览器内置引擎，无需配置', '调整复杂度参数', '点击生成即可'],
    features: ['Perlin噪声', '自然纹理', '有机图案', '地形模拟'],
    setupUrl: undefined
  }
];

export const LOCAL_ENGINES: LocalEngineDefinition[] = [
  {
    type: 'local',
    name: 'ComfyUI',
    icon: 'Box',
    description: '功能强大的节点式AI绘画界面，支持自定义工作流',
    color: '#8b5cf6',
    serverType: 'comfyui',
    defaultPort: 8188,
    apiFormat: 'custom',
    primaryCredentialField: {
      key: 'serverUrl',
      label: '服务器地址',
      placeholder: 'http://127.0.0.1:8188',
      type: 'url',
      required: true,
      helpText: 'ComfyUI 本地服务器地址'
    },
    advancedCredentialFields: [
      {
        key: 'workflow',
        label: '工作流 ID（可选）',
        placeholder: '默认工作流',
        type: 'text',
        required: false,
        helpText: '指定使用的工作流 ID'
      },
      {
        key: 'timeout',
        label: '超时时间（秒）',
        placeholder: '60',
        type: 'text',
        required: false,
        helpText: '生成超时时间，默认60秒'
      }
    ],
    defaultModels: [],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '下载并安装 ComfyUI (github.com/comfyanonymous/ComfyUI)',
      '启动 ComfyUI 服务（确保本地服务器运行）',
      '确认服务器地址，通常为 http://127.0.0.1:8188',
      '根据需要加载自定义工作流'
    ],
    features: ['节点式工作流', '完全自定义', '支持 LoRA', '社区资源丰富'],
    setupUrl: 'https://github.com/comfyanonymous/ComfyUI'
  },
  {
    type: 'local',
    name: 'Stable Diffusion WebUI',
    icon: 'Layers',
    description: '最流行的 Stable Diffusion Web 界面，易于使用',
    color: '#f97316',
    serverType: 'automatic1111',
    defaultPort: 7860,
    apiFormat: 'openai',
    primaryCredentialField: {
      key: 'serverUrl',
      label: '服务器地址',
      placeholder: 'http://127.0.0.1:7860',
      type: 'url',
      required: true,
      helpText: 'WebUI 本地服务器地址'
    },
    advancedCredentialFields: [
      {
        key: 'sdModel',
        label: 'SD 模型',
        placeholder: '默认模型',
        type: 'text',
        required: false,
        helpText: '使用的 Stable Diffusion 模型名称'
      },
      {
        key: 'sampler',
        label: '采样器',
        placeholder: 'Euler a',
        type: 'text',
        required: false,
        helpText: '采样方法，如 Euler a, DPM++ 2M Karras'
      },
      {
        key: 'steps',
        label: '采样步数',
        placeholder: '20',
        type: 'text',
        required: false,
        helpText: '生成步数，越多越精细'
      },
      {
        key: 'cfgScale',
        label: 'CFG Scale',
        placeholder: '7',
        type: 'text',
        required: false,
        helpText: '提示词引导强度，通常 7-12'
      }
    ],
    defaultModels: [],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '安装 Stable Diffusion WebUI',
      '启动 WebUI 服务（需要启用 --api 参数）',
      '确认服务器地址，通常为 http://127.0.0.1:7860',
      '在 Settings - API 中确保启用 API 访问'
    ],
    features: ['易于使用', '模型丰富', '插件生态', '快速上手'],
    setupUrl: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui'
  },
  {
    type: 'local',
    name: 'LM Studio',
    icon: 'Cpu',
    description: '桌面端大语言模型工具，支持 OpenAI 兼容 API',
    color: '#3b82f6',
    serverType: 'lmstudio',
    defaultPort: 1234,
    apiFormat: 'openai',
    primaryCredentialField: {
      key: 'serverUrl',
      label: '服务器地址',
      placeholder: 'http://127.0.0.1:1234',
      type: 'url',
      required: true,
      helpText: 'LM Studio 本地服务器地址'
    },
    advancedCredentialFields: [
      {
        key: 'modelName',
        label: '模型名称',
        placeholder: '加载的模型名称',
        type: 'text',
        required: false,
        helpText: 'LM Studio 中加载的模型名称'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        placeholder: '0.7',
        type: 'text',
        required: false,
        helpText: '生成温度，影响创意程度'
      },
      {
        key: 'maxTokens',
        label: '最大 Token',
        placeholder: '1000',
        type: 'text',
        required: false,
        helpText: '最大生成 token 数'
      }
    ],
    defaultModels: [],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '下载并安装 LM Studio (lmstudio.ai)',
      '下载并加载本地大模型（如 Qwen, Llama, Yi 等）',
      '在 LM Studio 中启动本地服务器',
      '确认服务器地址并配置模型'
    ],
    features: ['桌面应用', '模型管理', 'OpenAI 兼容', '隐私保护'],
    setupUrl: 'https://lmstudio.ai'
  },
  {
    type: 'local',
    name: 'Ollama',
    icon: 'Terminal',
    description: '命令行大模型工具，支持本地部署',
    color: '#10b981',
    serverType: 'ollama',
    defaultPort: 11434,
    apiFormat: 'openai',
    primaryCredentialField: {
      key: 'serverUrl',
      label: '服务器地址',
      placeholder: 'http://127.0.0.1:11434',
      type: 'url',
      required: true,
      helpText: 'Ollama 本地服务器地址'
    },
    advancedCredentialFields: [
      {
        key: 'modelName',
        label: '模型名称',
        placeholder: 'llama3, qwen2, yi 等',
        type: 'text',
        required: false,
        helpText: '下载的模型名称，如 llama3:8b'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        placeholder: '0.7',
        type: 'text',
        required: false,
        helpText: '生成温度'
      }
    ],
    defaultModels: [],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '安装 Ollama (ollama.com)',
      '使用 ollama pull 下载模型，如：ollama pull llama3',
      '启动 Ollama 服务（默认后台运行）',
      '确认 API 地址 http://127.0.0.1:11434'
    ],
    features: ['命令行工具', '资源占用低', '模型多样', '易于部署'],
    setupUrl: 'https://ollama.com'
  },
  {
    type: 'local',
    name: '自定义服务器',
    icon: 'Server',
    description: '连接任意 OpenAI 兼容的本地 API 服务器',
    color: '#6b7280',
    serverType: 'custom',
    defaultPort: 8000,
    apiFormat: 'openai',
    primaryCredentialField: {
      key: 'serverUrl',
      label: '服务器地址',
      placeholder: 'http://127.0.0.1:8000/v1',
      type: 'url',
      required: true,
      helpText: '自定义 API 服务器地址'
    },
    advancedCredentialFields: [
      {
        key: 'apiKey',
        label: 'API Key（可选）',
        placeholder: '如果服务器需要认证',
        type: 'password',
        required: false,
        helpText: '自定义服务器的 API 密钥'
      },
      {
        key: 'modelName',
        label: '模型名称',
        placeholder: '你的模型标识符',
        type: 'text',
        required: false,
        helpText: '请求中使用的 model 参数'
      }
    ],
    defaultModels: [],
    requiresProxy: false,
    region: 'local',
    guideSteps: [
      '启动你的本地 API 服务器',
      '确保服务器支持 OpenAI 兼容格式',
      '输入完整的服务器地址',
      '配置认证信息（如需要）'
    ],
    features: ['完全自定义', '灵活配置', '任意框架', '无限可能'],
    setupUrl: undefined
  }
];

export const FREE_ENGINES: FreeEngineDefinition[] = [
  {
    type: 'pollinations',
    name: 'Pollinations.AI',
    icon: 'Layers',
    description: '完全免费的 AI 图像生成服务',
    color: '#10a37f',
    primaryCredentialField: {
      key: 'seed',
      label: 'Seed（可选）',
      placeholder: '随机生成',
      type: 'text',
      required: false,
      helpText: 'Pollinations 无需 API Key，完全免费'
    },
    advancedCredentialFields: [
      {
        key: 'width',
        label: '宽度（默认 1024）',
        placeholder: '1024',
        type: 'text',
        required: false,
        helpText: '图像宽度像素值'
      },
      {
        key: 'height',
        label: '高度（默认 1024）',
        placeholder: '1024',
        type: 'text',
        required: false,
        helpText: '图像高度像素值'
      },
      {
        key: 'model',
        label: '模型（可选）',
        placeholder: '默认',
        type: 'text',
        required: false,
        helpText: '可选择不同模型'
      }
    ],
    defaultModels: ['default', 'realistic', 'anime', 'portrait', 'landscape'],
    requiresProxy: false,
    region: 'global',
    guideSteps: [
      'Pollinations.AI 无需注册和 API Key',
      '直接访问 pollinations.ai 使用',
      '或在 AI Studio 中直接调用',
      '完全免费的图像生成服务'
    ],
    freeLimit: '完全免费，无限制',
    freeFeatures: ['无需 API Key', '多种风格选择', '快速生成', '支持中文']
  }
];

// ============================================================================
// 付费引擎列表
// ============================================================================

export const SUPPORTED_ENGINES: EngineDefinition[] = [
  {
    type: 'ali',
    name: '阿里通义',
    icon: 'Cloud',
    description: '阿里云通义万相图像生成',
    color: '#ff6a00',
    primaryCredentialField: {
      key: 'apiKey',
      label: 'API Key',
      placeholder: 'sk-...',
      type: 'password',
      required: true,
      helpText: '阿里云控制台获取'
    },
    advancedCredentialFields: [
      {
        key: 'endpoint',
        label: 'API 端点（通常无需填写）',
        placeholder: 'wanxiang.cn-shanghai.aliyuncs.com',
        type: 'url',
        required: false,
        helpText: '系统会自动选择最佳端点'
      }
    ],
    defaultModels: ['wanx-v1'],
    requiresProxy: false,
    region: 'CN',
    regionName: '中国大陆',
    guideSteps: [
      '登录阿里云控制台 (aliyun.com)',
      '搜索「通义万相」并开通服务',
      '在「API-KEY管理」创建 API Key',
      '复制密钥并粘贴到上方'
    ]
  },
  {
    type: 'openai',
    name: 'OpenAI DALL-E',
    icon: 'Circle',
    description: 'OpenAI 开发的DALL-E图像生成模型',
    color: '#10a37f',
    primaryCredentialField: {
      key: 'apiKey',
      label: 'API 密钥',
      placeholder: 'sk-...',
      type: 'password',
      required: true,
      helpText: '只需这一步即可开始使用'
    },
    advancedCredentialFields: [
      {
        key: 'baseUrl',
        label: 'API 端点（可选）',
        placeholder: 'https://api.openai.com/v1',
        type: 'url',
        required: false,
        helpText: '使用代理时填写自定义端点'
      }
    ],
    defaultModels: ['dall-e-3', 'dall-e-2'],
    requiresProxy: false,
    region: 'global',
    guideSteps: [
      '访问 OpenAI Platform (platform.openai.com)',
      '登录你的 OpenAI 账号',
      '点击「API Keys」创建新密钥',
      '复制以 sk- 开头的密钥并粘贴'
    ]
  },
  {
    type: 'stability',
    name: 'Stability AI',
    icon: 'Layers',
    description: 'Stable Diffusion 官方API服务',
    color: '#0066ff',
    primaryCredentialField: {
      key: 'apiKey',
      label: 'API 密钥',
      placeholder: 'sk-...',
      type: 'password',
      required: true,
      helpText: 'Stability AI Platform 获取'
    },
    advancedCredentialFields: [],
    defaultModels: ['stable-diffusion-xl-1.0', 'stable-diffusion-xl-1.0-base', 'stable-diffusion-3-medium'],
    requiresProxy: false,
    region: 'global',
    guideSteps: [
      '访问 Stability AI Platform (platform.stability.ai)',
      '登录或注册账号',
      '在「Account-API Keys」创建密钥',
      '复制密钥并粘贴到上方'
    ]
  }
];

// ============================================================================
// 获取引擎定义
export function getEngineDefinition(type: EngineType): EngineDefinition | undefined {
  let definition = SUPPORTED_ENGINES.find(e => e.type === type);
  if (definition) return definition;
  
  definition = FREE_ENGINES.find(e => e.type === type);
  if (definition) return definition;
  
  definition = LOCAL_ENGINES.find(e => e.type === type);
  return definition;
}

// ============================================================================
// 设置状态类型
// ============================================================================

export interface SettingsState {
  theme: 'dark' | 'light';
  dynamicPrimaryColor: string;
  backgroundImage: string | null;
  backgroundOpacity: number;
  backgroundBlur: number;
  autoSave: boolean;
  cloudSyncEnabled: boolean;
  showAdvanced: boolean;
  
  // 引擎配置
  engineConfigs: EngineConfig[];
  activeEngineId: string | null;

  // 图片生成设置
  imageStyle: string;
  imageQuality: 'low' | 'high' | 'ultra';
  imageCount: number;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export const THEME_COLORS = [
  '#6366f1', '#3b82f6', '#22c55e', '#f59e0b', 
  '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4',
];

// UI状态类型
export interface UIState {
  isGenerating: boolean;
  currentImage: string | null;
  referenceImage: string | null;
  aspectRatio: AspectRatio;
  error: string | null;
  successMessage: string | null;
}

// 宽高比选项类型
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

// 错误响应类型
export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// 应用状态类型
export interface AppState {
  settings: SettingsState;
  ui: UIState;
  history: GenerationHistory[];
  addToHistory: (item: GenerationHistory) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
  setGenerating: (generating: boolean) => void;
  setCurrentImage: (image: string | null) => void;
  setReferenceImage: (image: string | null) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  resetUI: () => void;
  
  // 多引擎管理方法
  addEngineConfig: (config: EngineConfig) => void;
  removeEngineConfig: (id: string) => void;
  updateEngineConfig: (id: string, updates: Partial<EngineConfig>) => void;
  setActiveEngine: (id: string) => void;
  getActiveEngine: () => EngineConfig | null;
}
