const cacheName = 'Project v1',
    filesToCache = [
        '/',
        '/index.html',
        '/css/main.css',
        '/css/fonts/Lato-Regular.ttf',
        '/css/fonts/Lato-Italic.ttf',
        '/css/fonts/Lato-Bold.ttf',
        '/scripts/script.js',
        '/images/postal.jpg'
    ];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(cacheName).then(cache => cache.addAll(filesToCache))
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(oldCache => {
        if (oldCache !== cacheName) {
          return caches.delete(oldCache);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});