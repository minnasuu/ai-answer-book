// 混元API配置
const isDev = import.meta.env.DEV

// API URL 配置
// 开发环境：使用代理 /api
// 生产环境：优先使用环境变量，否则使用相对路径（需要服务器配置反向代理）
export const HUNYUAN_API_URL = isDev 
  ? '/api/openapi/v1/chat/completions'  // 开发环境使用代理
  : (import.meta.env.VITE_HUNYUAN_API_URL || '/web/minna/ai-answer/api/openapi/v1/chat/completions')

export const HUNYUAN_API_KEY = import.meta.env.VITE_HUNYUAN_API_KEY || 'e9f263c8-b1b7-449e-81bb-30dac102e4be'
export const HUNYUAN_MODEL = import.meta.env.VITE_HUNYUAN_MODEL || 'hunyuan-turbos-latest'

// 分类样式配置
export const CATEGORY_STYLE = "经典答案之书风格，简洁精炼（不超过20字）"
