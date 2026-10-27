import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath, URL} from 'url';
import {defineConfig} from 'vite';

const SHARED_SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), xr-spatial-tracking=()',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      headers: SHARED_SECURITY_HEADERS,
    },
    preview: {
      headers: {
        ...SHARED_SECURITY_HEADERS,
        'Strict-Transport-Security': 'max-age=31536000',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; media-src 'self'; frame-src 'self' https://docs.google.com https://forms.gle https://accounts.google.com https://*.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
  };
});



