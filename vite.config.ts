import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcertImport from 'vite-plugin-mkcert';

const mkcert = mkcertImport as unknown as () => any;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  base: '/scheduler/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    strictPort: true,
    //https: generateCerts(),
    proxy: {
      // proxy API requests to the ASP.NET backend
      '/login': {
        target: 'https://localhost:3000', // URL вашого Express сервера
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\//, '/'),
      },
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
