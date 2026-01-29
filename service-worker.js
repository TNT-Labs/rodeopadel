// Service Worker per funzionamento offline
const CACHE_NAME = 'torneo-2vs2-v3';

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

// Attivazione: pulizia cache vecchie e notifica aggiornamento
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Pulisci cache vecchie
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Rimozione cache vecchia:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Prendi il controllo immediato di tutte le pagine
            self.clients.claim(),
            // Notifica tutte le pagine aperte per forzare il reload
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        message: 'Nuova versione disponibile. Aggiornamento in corso...'
                    });
                });
            })
        ])
    );
});

// Fetch: strategia network-first con fallback a cache (per garantire aggiornamenti)
self.addEventListener('fetch', (event) => {
    // Per le richieste HTML, preferisci sempre la rete per ottenere aggiornamenti
    if (event.request.destination === 'document' || 
        event.request.url.includes('index.html') ||
        event.request.url.includes('.js') ||
        event.request.url.includes('.css')) {
        
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Se la richiesta di rete ha successo, aggiorna la cache
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Se la rete fallisce, usa la cache
                    return caches.match(event.request);
                })
        );
    } else {
        // Per altre risorse, usa cache-first
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then((response) => {
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        return response;
                    });
                })
                .catch(() => {
                    if (event.request.destination === 'document') {
                        const baseUrl = self.location.origin + self.location.pathname.replace(/service-worker\.js$/, '');
                        return caches.match(baseUrl + 'index.html');
                    }
                })
        );
    }
});
