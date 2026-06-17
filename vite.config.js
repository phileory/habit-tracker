import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/habit-tracker/', // TAMBAHKAN BARIS INI
  plugins: [
    react(),
    // ... (kode VitePWA biarkan persis seperti sebelumnya)