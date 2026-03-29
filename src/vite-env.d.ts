/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_KAKAO_MAP_KEY: string
  readonly VITE_USE_MOCK?: string
  readonly VITE_ENABLE_INTERNAL_LOGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
