const CACHE_NAME = 'habit-tracker-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        // Suppress errors for external CDNs failing to cache during install due to CORS
        return Promise.all(urlsToCache.map(url => {
            return cache.add(url).catch(err => console.log('Cache add failed for', url, err));
        }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 캐시에 있으면 반환, 없으면 네트워크 요청
      return response || fetch(event.request).catch(() => {
          console.log('Fetch failed; returning offline page instead.', event.request.url);
      });
    })
  );
});