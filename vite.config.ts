import { defineConfig } from 'vite';

export default defineConfig({
  // Se sw.js e manifest.json estiverem na raiz, o Vite os trata como assets estáticos 
  // se referenciados corretamente no index.html.
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // Garante que assets pequenos não sumam se precisarem de path fixo
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});