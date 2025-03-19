const CACHE_NAME = 'game-cache-v1';
const FILE_URL = 'https://cdn.jsdelivr.net/gh/gran2-grnny/ddd@main/sur.xml';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(FILE_URL);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Öncelikli olarak cache’den getir
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone()); // Cache’e kaydet
          return networkResponse;
        });
      });
    }).catch(() => {
      return new Response('Bağlantı yok ve önbellekte bulunamadı.', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});
