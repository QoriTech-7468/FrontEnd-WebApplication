import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Recognize Google Maps custom elements as native custom elements
          isCustomElement: (tag) => tag.startsWith('gmp-')
        }
      }
    })
  ],
})
