import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(async () => {
    return {
        test: {
            globals: true,
            environment: 'jsdom',
        },
        plugins: [
            react(),
            visualizer({
                open: process.env.NODE_ENV !== 'CI',
                filename: './dist/stats.html',
            }),
        ],
        define: {
            'process.env': process.env,
        },
        server: {
            port: 8000,
            open: true,
    },
    base: './',
    esbuild: {
        keepNames: true,
    },
        build: {
            sourcemap: true,
            rollupOptions: {
                plugins: [preserveDirectives()],
            },
        },
        resolve: {
            preserveSymlinks: true
        },
    };
});
