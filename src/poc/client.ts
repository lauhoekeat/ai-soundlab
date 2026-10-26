export function proxyUrl(): string {
  if (import.meta.env.PROD && !import.meta.env.VITE_PROXY_URL) throw new Error('Pelayan AI belum disediakan. Kamu masih boleh meneruskan aktiviti tanpa AI.');
  const value = import.meta.env.VITE_PROXY_URL || 'http://127.0.0.1:8787';
  const url = new URL(value);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === '127.0.0.1')) throw new Error('Proxy mesti menggunakan HTTPS.');
  return url.origin;
}
