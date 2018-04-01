//
//service worker file

//cacheName
const cacheName = 'v2';
const cacheFiles = [
    '.',
    'index.html',
    'restaurant.html',
    'sw.js',
    'js/app.js',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'css/styles.css',
    'data/restaurants.json',
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
self.addEventListener("fetch", function (event) {
    console.log("Service WorkeR Fetching");
});