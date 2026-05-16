const CACHE = 'cm-v3';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET')return;
  if(!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r.status===200){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c);});}
    return r;
  }).catch(function(){return caches.match(e.request).then(function(c){return c||caches.match('/index.html');});}));
});
