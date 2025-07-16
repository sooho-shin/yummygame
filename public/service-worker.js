self.addEventListener("install", event => {
  // Add a call to skipWaiting here if you want the new SW to take control immediately:
  // self.skipWaiting();
});

self.addEventListener("activate", event => {});

self.addEventListener("fetch", event => {});
