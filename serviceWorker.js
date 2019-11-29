/* eslint-disable max-nested-callbacks */
const cacheName = 'www.unpkg.com';

self.addEventListener('activate', () => {
  console.log('service worker activated');
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('https://unpkg') &&
    !event.request.referrer.includes('https://unpkg.com/')
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
