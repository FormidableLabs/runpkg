const cacheName = 'www.runpkg.com';

self.addEventListener('activate', e => {
  console.log('activated');
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    event.request.url.includes('https://unpkg')
      ? caches.open(cacheName).then(function(cache) {
          return cache.match(event.request).then(function(response) {
            var fetchPromise = fetch(event.request).then(function(
              networkResponse
            ) {
              if (networkResponse.status === 302) {
                fetch(`https://unpkg.com${networkResponse.location}`).then(
                  networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                  }
                );
              } else {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              }
            });

            // response contains cached data, if available
            return response || fetchPromise;
          });
        })
      : fetch(event.request).then(res => res)
  );
});
