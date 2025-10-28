// 混元API配置
// API URL 配置 - 使用你的云服务器代理解决CORS问题
export const HUNYUAN_API_URL = import.meta.env.VITE_HUNYUAN_API_URL || 'https://minnasu-any1.devcloud.woa.com/api/openapi/v1/chat/completions'

export const HUNYUAN_API_KEY = import.meta.env.VITE_HUNYUAN_API_KEY || 'e9f263c8-b1b7-449e-81bb-30dac102e4be'
export const HUNYUAN_MODEL = import.meta.env.VITE_HUNYUAN_MODEL || 'hunyuan-turbos-latest'

// 分类样式配置
export const CATEGORY_STYLE = "经典答案之书风格，简洁精炼（不超过20字）"
