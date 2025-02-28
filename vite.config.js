import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Abre el navegador automáticamente
    port: 5173, // Cambia el puerto si lo deseas
  },
});