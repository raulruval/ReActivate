const cacheName = 'ReActívate';
const appShellFiles = [
  './',
  './index.html',
  './favicon.ico',
  './bundle.js',
  './assets/img/icons/icon-32.png',
  './assets/img/icons/icon-64.png',
  './assets/img/icons/icon-96.png',
  './assets/img/icons/icon-128.png',
  './assets/img/icons/icon-168.png',
  './assets/img/icons/icon-192.png',
  './assets/img/icons/icon-256.png',
  './assets/img/icons/icon-512.png',
  './assets/img/red.png',
  './assets/img/phaser3-logo.png',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(appShellFiles);
    }),
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return (
        r ||
        fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    }),
  );
});
