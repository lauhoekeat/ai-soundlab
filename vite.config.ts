import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ command, mode }) => {
  const value = loadEnv(mode, '.', 'VITE_').VITE_PROXY_URL || 'http://127.0.0.1:8787';
  const proxy = new URL(value);
  if (proxy.protocol !== 'https:' && !(proxy.protocol === 'http:' && proxy.hostname === '127.0.0.1')) throw new Error('Proxy must use HTTPS or local loopback');
  return {
    plugins: [react(), { name: 'soundlab-csp', transformIndexHtml(html) {
      // Vite development injects styles/HMR. Production retains a locked policy.
      if (command === 'serve') return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*\/>/, '');
      return html.replace("connect-src 'self' http://127.0.0.1:8787 https:", `connect-src 'self' ${loadEnv(mode, '.', 'VITE_').VITE_PROXY_URL ? proxy.origin : ''}`);
    } }], base: '/ai-soundlab/', server: { port: 5173, strictPort: true },
  };
});
