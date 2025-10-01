// sw.js — Project Feed PWA
const STATIC_CACHE = "pf-static-v1";
const RUNTIME_CACHE = "pf-runtime-v1";

// Daftar shell aplikasi yang penting untuk offline (relative ke scope)
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./offline.html",
  "./logo.png"
];

// Helper
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const resp = await fetch(request);
  if (resp && resp.ok) cache.put(request, resp.clone());
  return resp;
}

async function staleWhileRevalidate(request, cacheName = RUNTIME_CACHE) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(resp => {
    if (resp && resp.ok) cache.put(request, resp.clone());
    return resp;
  }).catch(() => undefined);
  return cached || fetchPromise || fetch(request);
}

function networkWithTimeout(request, ms = 6000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(request, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

// Install
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(APP_SHELL);
    self.skipWaiting();
  })());
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
      if (![STATIC_CACHE, RUNTIME_CACHE].includes(k)) return caches.delete(k);
    }));
    await self.clients.claim();
  })());
});

// Fetch
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Navigations (alamat bar): Network-first → fallback cache/offline
  if (request.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const c = await caches.open(RUNTIME_CACHE);
        c.put("./", fresh.clone());
        return fresh;
      } catch {
        const cStatic = await caches.open(STATIC_CACHE);
        return (await cStatic.match("./index.html")) || (await cStatic.match("./offline.html"));
      }
    })());
    return;
  }

  // Fonts
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    e.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Gambar/icon eksternal
  if (url.hostname.includes("icons.llama.fi") || request.destination === "image") {
    e.respondWith(staleWhileRevalidate(request));
    return;
  }

  // API dinamis — network only (hindari cache data kripto basi)
  if ([
    "api.llama.fi",
    "coins.llama.fi",
    "api.coingecko.com",
    "api.github.com",
    "api.frankfurter.app",
    "api.exchangerate.host"
  ].includes(url.hostname)) {
    e.respondWith(
      networkWithTimeout(request, 6000).catch(() =>
        new Response(JSON.stringify({ ok: false, offline: true }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  // Default: static cache-first
  e.respondWith(cacheFirst(request));
});
