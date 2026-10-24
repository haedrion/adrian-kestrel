import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    // This tells Vite to embed ALL images regardless of size or extension (.jpg or .jpeg)
    assetsInlineLimit: 100000000, 
  }
})

