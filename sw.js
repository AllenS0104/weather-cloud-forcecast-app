// sw.js
const CACHE_NAME = 'weather-app-v1';   // 每次改文件后把 v1 → v2
const PRECACHE_LIST = [
  '/',
  '/index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // 其他首屏必须资源 …
];

/* 安装阶段：预缓存 */
self.addEventListener('install', e => {
  self.skipWaiting();                       // 立即接管
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_LIST))
  );
});

/* 激活阶段：清理旧缓存 */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())      // 立即对现有页面生效
  );
});

/* 拦截请求：缓存优先 → 后台更新 */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;   // 只缓存 GET
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networked = fetch(e.request).then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(e.request, resClone));
        return response;
      });
      // 有缓存先用，没缓存就等网络
      return cached || networked;
    })
  );
});