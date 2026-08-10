/* Service Worker for Babli Bakery Admin & PWA App */
const CACHE_NAME = 'babli-bakery-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/* Listen for push / notification events */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: '🛎️ New Order Received!', body: 'Check Admin Dashboard now.' };
  
  const options = {
    body: data.body || 'A new order has been placed on Babli Bakery!',
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [300, 100, 300, 100, 300],
    data: { url: '/admin/dashboard' },
    actions: [
      { action: 'open', title: '👀 View Order' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🍕 Babli Bakery - New Order!', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/admin/dashboard');
      }
    })
  );
});
