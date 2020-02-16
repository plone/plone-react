export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  
      window.addEventListener('load', () => {
        const swUrl = '/service-worker.js';
        registerValidSW(swUrl, config);
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log("Service Worker Successfully register");
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  


export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }