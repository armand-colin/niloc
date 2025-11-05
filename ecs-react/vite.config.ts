import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'dist',
      fileName: 'dist'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@niloc/ecs'],
    }
  }
})
