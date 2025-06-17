function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export async function initPushNotification() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    const vapidPublicKey = 'BALFplDw4UjFe-eBDtpRYQiID0ZQ8RiRnl0vLMdf1yxfii4cO6dPlCjr6WgWfEX6KGTux9tOHQI_j0fSH-Mh38o';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Cek jika sudah ada subscription
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      const existingKey = existingSubscription.options.applicationServerKey;
      const existingKeyString = btoa(String.fromCharCode(...new Uint8Array(existingKey || [])));
      const newKeyString = btoa(String.fromCharCode(...convertedVapidKey));

      if (existingKeyString !== newKeyString) {
        console.log('Unsubscribing existing push...');
        await existingSubscription.unsubscribe();
      } else {
        console.log('Push already subscribed.');
        return;
      }
    }

    // Buat subscription baru
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // Kirim ke server
    await fetch('http://localhost:3000/save-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    console.log('Push subscribed:', subscription);
  } catch (error) {
    console.error('Push Notification Error:', error);
  }
}
