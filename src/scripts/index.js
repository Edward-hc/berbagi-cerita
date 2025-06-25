// CSS imports
import '../styles/styles.css';
import { initPushNotification } from './utils/notification-init';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();
  initPushNotification();

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Terdaftar:', registration);
    } catch (err) {
      console.error('[SW] Gagal daftar:', err);
    }
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
