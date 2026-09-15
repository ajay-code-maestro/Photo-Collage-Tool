import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const processEnv: Record<string, string> = {};

  for (const key in env) {
    if (
      key.startsWith('NEXT_PUBLIC_') ||
      key.startsWith('VITE_') ||
      key === 'NODE_ENV'
    ) {
      processEnv[key] = env[key];
    }
  }

  return {
    plugins: [react()],

    // GitHub Pages repository path
    base: '/Photo-Collage-Tool/',

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
