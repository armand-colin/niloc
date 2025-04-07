/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'dist',
      fileName: 'dist'
    }
  },
  test: {
    include: ['tests/**/*.test.ts']
  }
})
