// CSS imports
import '../styles/styles.css';
import { initPushNotification } from './utils/notification-init';

import App from './pages/app';
async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>', // ganti dengan public key dari server
  });

  await fetch('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    subscribeUserToPush();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Terdaftar:', registration);

      await navigator.serviceWorker.ready;
      await initPushNotification(registration);
    } catch (err) {
      console.error('[SW] Gagal daftar:', err);
    }
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
