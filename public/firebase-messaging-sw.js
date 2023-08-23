importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js');


const firebaseConfig = {
    apiKey: "AIzaSyDIhAKJkCDUpqyecAEZc3XscAfu_tGDZlE",
    authDomain: "accountingbot-3b1a3.firebaseapp.com",
    projectId: "accountingbot-3b1a3",
    storageBucket: "accountingbot-3b1a3.appspot.com",
    messagingSenderId: "462698867283",
    appId: "1:462698867283:web:e4729b62f9b05180deb4a6",
    measurementId: "G-DM9LK7FFGN"
}
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  const notificationTitle = "AccountingBot Message";
  const notificationOptions = {
    body: `New ${payload.notification.title} received`,
  };
  // console.log('from back message', payload)
  const event = new CustomEvent('notification', payload);
  self.dispatchEvent(event);
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});