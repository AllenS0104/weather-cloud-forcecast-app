// sw.js (Service Worker)

const CACHE_NAME = 'weather-app-cache-v1';
// 需要缓存的核心文件列表
const urlsToCache = [
  '/',
  '/index.html',
  // 注意：我们不再缓存CSS和JS，因为它们都内联在HTML里了。
  // 但如果未来你把它们分离出来，就需要在这里添加路径。
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80'
];

// 监听 install 事件，在其中缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 监听 fetch 事件，拦截所有网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    // 先尝试从缓存中寻找匹配的响应
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，则直接返回缓存的响应
        if (response) {
          return response;
        }
        // 如果缓存中没有，则发起网络请求
        return fetch(event.request);
      }
    )
  );
});