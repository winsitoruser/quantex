// Self-unregistering service worker - clears stale caches
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
  caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  self.registration.unregister();
});
