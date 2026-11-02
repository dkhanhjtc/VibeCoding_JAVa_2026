import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import analyzeHandler from './api/analyze.js'

// Cho /api/analyze chạy cùng `npm run dev` và `npm run preview`, giống môi trường Vercel
const localApiPlugin = () => {
  const attachApi = (server) => {
    server.middlewares.use('/api/analyze', async (req, res) => {
      let rawBody = ''
      for await (const chunk of req) rawBody += chunk

      let body = {}
      try {
        body = JSON.parse(rawBody || '{}')
      } catch {
        res.statusCode = 400
        res.end('Invalid JSON')
        return
      }

      await analyzeHandler({ method: req.method, body }, {
        status(code) {
          res.statusCode = code
          return this
        },
        json(payload) {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }
      })
    })
  }

  return { name: 'local-api', configureServer: attachApi, configurePreviewServer: attachApi }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Biến không có tiền tố VITE_ chỉ nằm ở server, không lọt vào bundle của trình duyệt
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL

  return { plugins: [react(), localApiPlugin()] }
})
