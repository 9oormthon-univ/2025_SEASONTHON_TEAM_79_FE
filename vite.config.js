import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 보호 API
      '/api': {
        target: 'http://43.200.96.110:8080', // ← 실제 백엔드 포트로!
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        proxyTimeout: 60000,
      },
      // 로그인/회원가입 (스웨거 경로 그대로: /users/...)
      '/users': {
        target: 'http://43.200.96.110:8080', // ← 위와 동일 포트
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        proxyTimeout: 60000,
        // ❌ rewrite 사용하지 않음 (백엔드가 /users/... 그대로 받음)
      },
    },
  },
})
