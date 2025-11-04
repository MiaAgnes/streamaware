import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isServe = command === "serve";

  const config = {
    plugins: [react()],
    server: {
      host: true, // Expose to network
      port: 5173,
    },
    base: "/",
  };

  // Change base path when building for production
  if (!isServe) {
    config.base = "/streamaware/"; // 👈 Replace with your GitHub repository name
  }

  return config;
});
