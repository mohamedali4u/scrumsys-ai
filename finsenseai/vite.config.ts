import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
      name: 'AIAgentWidget',
      fileName: 'widget',
      formats: ['umd', 'es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});