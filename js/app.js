//checing if there is service worker registered, if not we'll register it
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./sw.js', { scope: './' }) //link to the our service worker file; scope is the root directory
        .then(function (registration) {
            console.log('Service Worker Registered');
        }) //if the registration was successful, return the registration details to the console
        .catch(function (error) {
            console.log('Service Worker Failed to Register', error);
        }); //if there was an error, return the error to the console
}