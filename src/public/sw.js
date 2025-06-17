const CACHE_NAME = 'berbagi-cerita-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.bundle.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ambil file dari cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Push notification handler
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Magangin Notification';
  const options = {
    body: data.body || 'Ada update terbaru!',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
