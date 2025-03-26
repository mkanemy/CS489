import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'LockedIn',
      fileName: 'locked-in-frontend',
      formats: ['es'],
    }
  },
})
