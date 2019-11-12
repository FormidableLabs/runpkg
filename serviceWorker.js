/* eslint-disable max-nested-callbacks */
const cacheName = 'www.runpkg.com';

self.addEventListener('activate', () => {
  console.log('service worker activated');
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('https://unpkg') &&
    !event.request.referrer.includes('https://unpkg.com/')
  ) {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(event.request).then(response => {
          // if not in cache then fetch it and add to cache
          if (!response) {
            return fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          // if in cache then return it
          return response;
        });
      })
    );
  }
  return;
});
