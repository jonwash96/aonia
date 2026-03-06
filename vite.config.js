import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDotenv } from 'dotenv'
configDotenv();

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5175,
        cors: {
            origin: '*'
        },
        server: { allowedHosts: [process.env.__VITE_ALLOWED_HOSTS] }
    }
})