import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { SpeedInsights } from "@vercel/speed-insights/react"

const manualChunkGroups = {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-supabase': ['@supabase/supabase-js'],
  'vendor-motion': ['framer-motion'],
  'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
  'vendor-radix': [
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-tooltip',
  ],
};

const manualChunks = (id) => {
  if (!id.includes('node_modules')) return undefined;
  const normalizedId = id.replace(/\\/g, '/');

  for (const [chunkName, packages] of Object.entries(manualChunkGroups)) {
    if (packages.some((packageName) => normalizedId.includes(`/node_modules/${packageName}/`))) {
      return chunkName;
    }
  }

  return undefined;
};

export default defineConfig({
  plugins: [
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
