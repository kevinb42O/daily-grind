const CACHE_VERSION = 'v3';
const STATIC_CACHE = `daily-grind-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `daily-grind-runtime-${CACHE_VERSION}`;
const CACHE_PREFIX = 'daily-grind-';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/pwa-192.png',
  '/pwa-512.png',
  '/images/site/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith(CACHE_PREFIX) && name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function networkFirstNavigation(request) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      runtimeCache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await runtimeCache.match(request);
    if (cached) {
      return cached;
    }

    const shell = await caches.match('/index.html');
    if (shell) {
      return shell;
    }

    const offline = await caches.match('/offline.html');
    if (offline) {
      return offline;
    }

    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  return networkResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const {request} = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
