const cacheName = 'project',
    filesToCache = [
        '/',
        '/index.html',
        '/css/main.css',
        '/scripts/script.js',
        '/images/postal.jpg'
    ];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(cacheName).then(cache => cache.addAll(filesToCache))
    );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});