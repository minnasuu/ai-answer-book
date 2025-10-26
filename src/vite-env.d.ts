/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUNYUAN_API_URL?: string
  readonly VITE_HUNYUAN_API_KEY?: string
  readonly VITE_HUNYUAN_MODEL?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
