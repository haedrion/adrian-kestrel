import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/adrian-kestrel/', // Notice the quote closes right after the slash!
})
