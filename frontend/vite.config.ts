import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables from the frontend directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Filter variables to expose process.env compatibility for NEXT_PUBLIC_ and VITE_
  const processEnv: Record<string, string> = {};
  for (const key in env) {
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_') || key === 'NODE_ENV') {
      processEnv[key] = env[key];
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      'process.env': processEnv,
    },
    server: {
      port: 3000,
    },
  };
});
