//
//service worker file

//cacheName
const cacheName = 'v5';
const cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    'sw.js',
    './data/restaurants.json',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/app.js/',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg'
];


//installing the service worker
self.addEventListener("install", function (event) {
    console.log("Service WorkeR Installed");

    //install event is going to wait until the waitUntil promise is completed
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("Caching that files");
            return cache.addAll(cacheFiles);
        })
    );

});

//activating the service worker
self.addEventListener("activate", function (event) {
    console.log("Service WorkeR Activated");

    //we're now going to remove everything in cache that doesn't correspond the current cacheName
    event.waitUntil(
        //going throught all the keys in cache
        caches.keys().then(function (cacheNames) {
            //looping through everything in the cache
            return Promise.all(cacheNames.map(function (thisCacheName) {

                //if thisCacheName doesn't correcpond to the current cacheName
                if (thisCacheName !== cacheName) {
                    console.log("Removing the old cache");

                    //remove thisCacheName
                    return caches.delete(thisCacheName);
                }
            }))
        })
    );
});

//fetching
self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);

    // e.respondWidth Responds to the fetch event
    e.respondWith(
        // Check in cache for the request being made
        caches.match(e.request)
            .then(function (response) {

                // If the request is in the cache
                if (response) {
                    console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                    // Return the cached version
                    return response;
                }

                // If the request is NOT in the cache, fetch and cache

                var requestClone = e.request.clone();
                fetch(requestClone)
                    .then(function (response) {
                        if (!response) {
                            console.log("[ServiceWorker] No response from fetch ")
                            return response;
                        }

                        var responseClone = response.clone();

                        //  Open the cache
                        caches.open(cacheName).then(function (cache) {

                            // Put the fetched response in the cache
                            cache.put(e.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', e.request.url);

                            // Return the response
                            return response;

                        }); // end caches.open
                    })
                    .catch(function (err) {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });
            }) // end caches.match(e.request)
    ); // end e.respondWith
});