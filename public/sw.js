
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'DuoFlow';
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
