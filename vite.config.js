import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const endpointUrl = env.VITE_DATABRICKS_ENDPOINT_URL || ''

  let target = 'https://dbc-0907a775-590e.cloud.databricks.com'
  if (endpointUrl) {
    try {
      const url = new URL(endpointUrl)
      target = url.origin
    } catch (e) {
      console.error('Failed to parse VITE_DATABRICKS_ENDPOINT_URL target origin:', e)
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api/databricks': {
          target: target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/databricks/, ''),
        }
      }
    }
  }
})
