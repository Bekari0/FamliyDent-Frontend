const CACHE_NAME = 'familydent-static-v2';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
 event.waitUntil(
 caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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
 url.pathname.startsWith('/uploads')
 ) {
 return;
 }

 if (event.request.mode === 'navigate') {
 event.respondWith(
 fetch(event.request).catch(() => caches.match('/index.html'))
 );
 return;
 }

 event.respondWith(
 caches.match(event.request).then((cached) => {
 if (cached) return cached;
 return fetch(event.request).then((response) => {
 if (!response || response.status !== 200 || response.type !== 'basic') return response;
 const copy = response.clone();
 caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
 return response;
 });
 })
 );
});
