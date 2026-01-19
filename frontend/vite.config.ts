import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    base: "/",
    build: {
        outDir: "dist"
    },
    server: {
        port: Number(process.env.FRONTEND_PORT) || undefined,
        open: true,
        proxy: {
            "/api": {
                target: `http://localhost:${process.env.BACKEND_PORT || 5000}`,
                changeOrigin: true
            }
        }
    }
});
