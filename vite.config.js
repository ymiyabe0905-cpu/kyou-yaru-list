import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite の設定
export default defineConfig({
  plugins: [react()],
  // GitHub Pages はサブパス（/kyou-yaru-list/）で配信されるため、
  // 読み込むファイルのパスにこの接頭辞を付ける。
  // ローカル(npm run dev)では '/' のままにして普通に動くようにする。
  base: process.env.NODE_ENV === 'production' ? '/kyou-yaru-list/' : '/',
})
