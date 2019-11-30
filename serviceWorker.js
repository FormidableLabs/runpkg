/* eslint-disable max-nested-callbacks */
const cacheName = 'bunpkg.dev';

self.addEventListener('activate', () => {
  console.log('service worker activated');
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('https://bunpkg') &&
    !event.request.referrer.includes('https://bunpkg.dev/')
  ) {
    event.respondWith(
      caches.open(cacheName).then(cache =>
        cache.match(event.request).then(
          response =>
            response ||
            fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
        )
      )
    );
  }
  return;
});
