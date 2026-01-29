// Service Worker per funzionamento offline
const CACHE_NAME = 'torneo-2vs2-v1';

// Funzione per ottenere i percorsi relativi alla root dell'app
function getCacheUrls() {
    const baseUrl = self.location.origin + self.location.pathname.replace(/service-worker\.js$/, '');
    return [
        baseUrl,
        baseUrl + 'index.html',
        baseUrl + 'styles.css',
        baseUrl + 'app.js',
        baseUrl + 'manifest.json'
    ];
}

// Installazione: cache delle risorse
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aperta');
                const urlsToCache = getCacheUrls();
                return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
            })
            .catch((err) => {
                console.error('Errore durante la cache:', err);
            })
    );
    // Forza l'attivazione immediata del nuovo service worker
    self.skipWaiting();
});

// Attivazione: pulizia cache vecchie
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Rimozione cache vecchia:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Prendi il controllo immediato di tutte le pagine
    return self.clients.claim();
});

// Fetch: strategia cache-first con fallback a network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Ritorna dalla cache se disponibile
                if (response) {
                    return response;
                }
                
                // Altrimenti, fai una richiesta di rete
                return fetch(event.request).then((response) => {
                    // Controlla se la risposta è valida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clona la risposta per la cache
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
            .catch(() => {
                // Se sia cache che network falliscono, ritorna una pagina offline
                if (event.request.destination === 'document') {
                    const baseUrl = self.location.origin + self.location.pathname.replace(/service-worker\.js$/, '');
                    return caches.match(baseUrl + 'index.html');
                }
            })
    );
});
