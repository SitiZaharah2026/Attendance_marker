// CelikSense AI — Service Worker
// Provides offline support via network-first strategy with cache fallback

const CACHE_NAME = "celiksense-v1";
const OFFLINE_URL = "offline.html";

const FILES_TO_CACHE = [
  "index.html",
  "dashboard.html",
  "profile.html",
  "settings.html",
  "reading-companion.html",
  "ocr-agent.html",
  "blind-audio.html",
  "sign-language.html",
  "adhd-agent.html",
  "dyslexia-agent.html",
  "ai-librarian.html",
  "ai-teacher-agent.html",
  "personalisation-agent.html",
  "early-warning.html",
  "intervention.html",
  "teacher-dashboard.html",
  "pilot-evidence.html",
  "competition-dashboard.html",
  "demo-script.html",
  "user-validation.html",
  "shared.js",
  "styles.css",
  "voice-system.js",
  "braille-system.js",
  "bim-avatar.js",
  "avatar-creator.js",
  "personalisation-system.js",
  "demo-mode.js",
  "offline.html",
];

// ── Install ───────────────────────────────────────────────────────────────────
// Pre-cache all project files so they are available offline immediately.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache files individually so a single missing file does not abort the
      // entire install.
      const results = await Promise.allSettled(
        FILES_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Could not cache ${url}:`, err);
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.warn(`[SW] ${failed.length} file(s) failed to cache.`);
      }

      console.log("[SW] Install complete — pre-cache done.");
    })()
  );

  // Take control immediately without waiting for existing tabs to close.
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────────────────────
// Remove caches that belong to older versions of this service worker.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      );

      // Claim all open clients so the new SW takes effect without a reload.
      await self.clients.claim();

      console.log("[SW] Activate complete — old caches removed.");
    })()
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
// Strategy: Network-first → Cache fallback → Offline page (navigation only).
self.addEventListener("fetch", (event) => {
  // Only handle GET requests; let everything else pass through.
  if (event.request.method !== "GET") return;

  // Skip cross-origin requests (CDNs, external APIs, etc.).
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. Try the network first.
      try {
        const networkResponse = await fetch(event.request);

        // Cache a fresh copy of any successful response.
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        // Network unavailable — fall through to cache.
      }

      // 2. Try the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 3. For navigation requests, serve the offline fallback page.
      if (event.request.mode === "navigate") {
        const offlineResponse = await cache.match(OFFLINE_URL);
        if (offlineResponse) {
          return offlineResponse;
        }
      }

      // 4. Nothing we can do — return a generic 503.
      return new Response("Service unavailable. You appear to be offline.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain" },
      });
    })()
  );
});
