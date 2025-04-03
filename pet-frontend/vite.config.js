import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/members': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/pet': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/reservation': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});
