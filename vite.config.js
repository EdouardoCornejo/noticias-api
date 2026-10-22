import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GET } from './api/news.js'

/* Sirve /api/news en desarrollo con la misma función que usa Vercel. */
const newsApi = () => ({
  name: 'news-api',
  configureServer(server) {
    server.middlewares.use('/api/news', async (req, res) => {
      const response = await GET(new Request(new URL(req.originalUrl, 'http://localhost')))
      res.statusCode = response.status
      res.setHeader('Content-Type', 'application/json')
      res.end(await response.text())
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env.NEWS_API_KEY ??= loadEnv(mode, process.cwd(), '').NEWS_API_KEY

  return {
    plugins: [react(), newsApi()]
  }
})
