import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        include: ['**/*.test.{ts,tsx}'],
        globals: true,
        setupFiles: ['./test/setup.ts'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
        },
    },
})
