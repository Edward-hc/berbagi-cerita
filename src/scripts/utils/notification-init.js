function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export async function initPushNotification() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      const existingKey = existingSubscription.options.applicationServerKey;
      const existingKeyString = btoa(String.fromCharCode(...new Uint8Array(existingKey || [])));
      const newKeyString = btoa(String.fromCharCode(...convertedVapidKey));

      if (existingKeyString === newKeyString) {
        console.log('Push already subscribed.');
        return;
      }

      console.log('Unsubscribing existing push...');
      await existingSubscription.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    const subscriptionJSON = subscription.toJSON();

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({

        endpoint: subscriptionJSON.endpoint,

        keys: {

          auth: subscriptionJSON.keys.auth,

          p256dh: subscriptionJSON.keys.p256dh,

        }

      }),
    });

    console.log('Push subscribed:', subscription);
  } catch (error) {
    console.error('Push Notification Error:', error);
  }
}
