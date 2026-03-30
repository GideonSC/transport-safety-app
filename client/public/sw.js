const STATIC_CACHE = 'transport-safety-static-v1';
const DATA_CACHE = 'transport-safety-data-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            return caches.delete(key);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

function isApiRequest(request) {
  return request.url.includes('/api/');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (isApiRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(event.request, clonedResponse));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cachedResponse) => cachedResponse || new Response(JSON.stringify({ message: 'Offline and no cached data available.' }), { headers: { 'Content-Type': 'application/json' }, status: 503 })) )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
