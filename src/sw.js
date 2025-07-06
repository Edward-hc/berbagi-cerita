import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/icon.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
