const CACHE = 'soundlab-poc-assets-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  if (event.data?.type !== 'PREPARE') return;
  event.waitUntil((async () => {
    try {
      const index = await fetch('/', {cache: 'reload'});
      const html = await index.text();
      // Production builds only. A Vite source entry cannot be a verified offline bundle.
      if (html.includes('/src/main.ts')) throw Error('Build first: offline preparation is production-preview only.');
      const documentAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map(match => match[1]);
      if (!documentAssets.some(path => path.endsWith('.js'))) throw Error('No built entry asset found');
      const manifestResponse = await fetch('/models/base/manifest.json', {cache: 'reload'});
      if (!manifestResponse.ok) throw Error('Base asset manifest missing');
      const manifest = await manifestResponse.json();
      const buildResponse = await fetch('/.vite/manifest.json', {cache: 'reload'});
      if (!buildResponse.ok) throw Error('Built dependency manifest missing');
      const build = await buildResponse.json();
      const dependencies = Object.values(build).flatMap(entry => [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]).map(path => '/' + path);
      const paths = [...new Set(['/', '/index.html', '/tests/fixture.html', '/pcm-worklet.js', '/.vite/manifest.json', '/models/base/manifest.json', ...documentAssets, ...dependencies, ...manifest.artifacts.map(a => a.path)])];
      const stagingName = CACHE + '-' + Date.now();
      const staging = await caches.open(stagingName);
      for (const path of paths) {
        if (!path.startsWith('/') || path.startsWith('//') || path.includes('..')) throw Error('Unsafe cache path');
        const response = await fetch(path, {cache: 'reload'});
        if (!response.ok) throw Error(`Asset missing: ${path}`);
        if (manifest.artifacts.some(a => a.path === path)) {
          const bytes = await response.clone().arrayBuffer();
          const digest = await crypto.subtle.digest('SHA-256', bytes);
          const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
          const expected = manifest.artifacts.find(a => a.path === path);
          if (hash !== expected.sha256 || bytes.byteLength !== expected.bytes) throw Error('Cached model integrity failed');
        }
        await staging.put(path, response);
      }
      // Commit a pointer only after every asset is complete; retain last good
      // cache if any download or pointer write fails. No live background update.
      const state = await caches.open(CACHE + '-state');
      await state.put('/active-cache', new Response(stagingName));
      event.ports[0]?.postMessage({ok: true, message: `Prepared ${paths.length} shell/base assets. Object head and real sample inference must still be verified after restart offline.`});
    } catch (error) {event.ports[0]?.postMessage({ok: false, message: error.message});}
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(async () => {
    const state = await caches.open(CACHE + '-state');
    const active = await state.match('/active-cache');
    if (!active) return new Response('Offline cache not prepared', {status: 503});
    const cache = await caches.open(await active.text());
    const response = await cache.match(event.request, {ignoreSearch: true});
    return response ?? new Response('Offline asset unavailable', {status: 503});
  }));
});
