// Service Worker para Blocki PWA
const CACHE_NAME = 'blocki-v1';
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/claro.png',
  '/oscuro.png',
  '/Favicon_blocki.png'
];

// FASE 1: INSTALL - Cachear recursos estáticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// FASE 2: ACTIVATE - Limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      return self.clients.claim(); // Tomar control inmediatamente
    })
  );
});

// FASE 3: FETCH - Estrategia Cache-First con Network Fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones no-HTTP
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // NO cachear archivos JavaScript (obtener versión más reciente)
  // NO cachear llamadas a APIs
  if (url.pathname.match(/\.js$/i) || url.pathname.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Estrategia Cache-First para otros recursos
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Solo cachear respuestas válidas
            if (response && response.status === 200 && !url.pathname.match(/\.js$/i) && !url.pathname.includes('/api/')) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback offline: servir página principal para navegación
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Escuchar mensajes del cliente para actualizar el SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
