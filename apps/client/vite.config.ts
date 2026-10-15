import { defineConfig } from 'vite';

/**
 * Hosts that the dev server will accept in the Host header.
 *
 * Vite rejects unknown Host headers by default (a DNS-rebinding guard). Local
 * development normally only needs localhost, so the allowlist is opt-in via
 * VITE_DEV_ALLOWED_HOSTS, e.g.
 *
 *   VITE_DEV_ALLOWED_HOSTS=192.168.1.50,laptop.local npm run dev:client
 *
 * This is dev-server configuration only and is never part of the built bundle.
 */
function allowedHosts(): string[] {
  const raw = process.env.VITE_DEV_ALLOWED_HOSTS;
  if (!raw) {
    return ['localhost', '127.0.0.1'];
  }
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: allowedHosts(),
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: allowedHosts(),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
});
