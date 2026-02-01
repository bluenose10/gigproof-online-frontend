import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Middleware to serve static blog files before SPA fallback
function serveBlogFiles() {
  return {
    name: 'serve-blog-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if request is for blog path
        if (req.url.startsWith('/blog')) {
          let filePath = req.url
          // Handle /blog/ -> /blog/index.html
          if (filePath === '/blog' || filePath === '/blog/') {
            filePath = '/blog/index.html'
          }
          const fullPath = resolve(__dirname, 'public' + filePath)

          // Check if path exists
          if (fs.existsSync(fullPath)) {
            // If it's a directory, serve index.html from that directory
            if (fs.statSync(fullPath).isDirectory()) {
              const indexPath = resolve(fullPath, 'index.html')
              if (fs.existsSync(indexPath)) {
                res.setHeader('Content-Type', 'text/html')
                res.end(fs.readFileSync(indexPath, 'utf-8'))
                return
              }
            } else {
              // It's a file, serve it
              res.setHeader('Content-Type', 'text/html')
              res.end(fs.readFileSync(fullPath, 'utf-8'))
              return
            }
          }
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [serveBlogFiles(), react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
