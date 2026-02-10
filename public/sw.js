const CACHE_NAME = 'selfq-pwa-v26.02.08';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/images/logo/pwa-logo.png',
  '/images/logo/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Handle PWA installation
self.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  return event;
});