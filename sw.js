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
    './js/app.js',
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
    console.log("Service Worker Installed");

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
    console.log("Service Worker Activated");

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
self.addEventListener('fetch', function (event) {
    console.log("Fetch event");

    // event.respondWidth Responds to the fetch event
    event.respondWith(
        // Check in cache for the request being made
        caches.match(event.request)
            .then(function (response) {

                // If the request is in the cache
                if (response) {
                    console.log("Something is in cache");
                    return response;
                }

                // If the request is NOT in the cache, fetch and cache
                let clone = event.request.clone();
                //fetch and cache
                fetch(clone)
                    .then(function (response) {
                        if (!response) {
                            console.log("No response from fetch!")
                            return response;
                        }

                        let responseClone = response.clone();

                        //  Open the cache
                        caches.open(cacheName).then(function (cache) {

                            // Put the fetched response in the cache
                            cache.put(event.request, responseClone);
                            console.log("New Service worker data cached");

                            // Return the response
                            return response;

                        }); // end caches.open
                    })
                    .catch(function (err) {
                        console.log("Error Fetching and Caching new data!", err);
                    });
            }) // end caches.match(event.request)
    ); // end event.respondWith
});

//this tutorials helped me the most: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker-slides and https://www.youtube.com/watch?v=BfL3pprhnms
