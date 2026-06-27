import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite の設定（React を使うだけのシンプル構成）
export default defineConfig({
  plugins: [react()],
})
