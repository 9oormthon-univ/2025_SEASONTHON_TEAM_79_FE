// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://43.200.96.110",
        changeOrigin: true,
         cookieDomainRewrite: "localhost",
        rewrite: p => p.replace(/^\/api/, ""),
      },
    },
  },
})
