import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for local development
// Frontend runs on http://localhost:5173
// Backend API runs on http://localhost:5001
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
