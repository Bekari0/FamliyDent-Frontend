const CACHE_NAME = 'familydent-static-v3';
const FALLBACK_ASSETS = ['/index.html'];

self.addEventListener('install', (event) => {
 event.waitUntil(
 caches.open(CACHE_NAME).then((cache) => cache.addAll(FALLBACK_ASSETS))
 );
 self.skipWaiting();
});

self.addEventListener('activate', (event) => {
 event.waitUntil(
 caches.keys().then((keys) =>
 Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
 )
 );
 self.clients.claim();
});

self.addEventListener('fetch', (event) => {
 const url = new URL(event.request.url);

 if (
 event.request.method !== 'GET' ||
 url.pathname.startsWith('/api') ||
 url.pathname.startsWith('/uploads') ||
 url.pathname.startsWith('/assets')
 ) {
 return;
 }

 if (event.request.mode === 'navigate') {
 event.respondWith(
 fetch(event.request)
 .then((response) => {
 const copy = response.clone();
 caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
 return response;
 })
 .catch(() => caches.match('/index.html'))
 );
 return;
 }

 event.respondWith(
 fetch(event.request).catch(() => caches.match(event.request))
 );
});
