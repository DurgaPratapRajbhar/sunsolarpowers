import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV ;
const envFile =resolve(__dirname, `../shared/config/.env.${env}`);
dotenv.config({ path: envFile });
  
const apiProxyTarget = process.env.BASE_URL+":"+process.env.PRODUCT_API_PORT; 
const frontendPort = parseInt(process.env.ADMIN_FRONTEND_PORT);

console.log( process.env.ADMIN_FRONTEND_PORT)

//console.log(`apiProxyTarget: ${env==='production'}`);
export default defineConfig({
  plugins: [tailwindcss(), react()],
  envDir: envFile,
  server: {
    port: frontendPort,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: env==='production', 
      },
    },
  },

  define: {
    'process.env': process.env,
  },
});
