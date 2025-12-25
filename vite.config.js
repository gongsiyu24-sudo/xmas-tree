import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // 这里将 process.env.API_KEY 注入到前端代码中
    // 注意：在生产环境中这会将 Key 暴露在前端代码里，仅适用于纯前端演示项目
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
