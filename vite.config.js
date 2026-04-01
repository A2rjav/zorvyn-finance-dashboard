import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const isUserPageRepo = repo.toLowerCase().endsWith('.github.io')
const ghPagesBase = process.env.GITHUB_ACTIONS ? (isUserPageRepo ? '/' : `/${repo}/`) : '/'

export default defineConfig({
  base: ghPagesBase,
  plugins: [react(), tailwindcss()],
})
