/* eslint-disable max-nested-callbacks */
const cacheName = 'www.runpkg.com';

self.addEventListener('activate', () => {
  console.log('service worker activated');
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('https://unpkg') &&
    // so we don't intercept es imports
    !event.request.referrer.includes('https://unpkg.com/')
  ) {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          // response contains cached data, if available
          return response || fetchPromise;
        });
      })
    );
  }
  return;
});
