import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Ensure source maps are generated for production builds
  },
  server: {
    sourcemap: true, // Enable source maps in development mode
  },
  base: '/TechConnect/', // Adjust this to match your repository name
})