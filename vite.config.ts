import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/adrian-kestrel/', // 👈 This ensures the build paths match your GitHub Pages folder structure exactly
})
