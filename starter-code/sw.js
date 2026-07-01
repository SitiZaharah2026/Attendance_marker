// CelikSense AI — Intelligent Offline Service Worker v2
// Strategy: shell-first for static assets, network-first for dynamic content,
//           IndexedDB messaging for user content (books, OCR, AI cache).
//
// GitHub Pages compatibility: self.location.pathname is /CelikSense_AI/sw.js
// when deployed as a project page, so BASE_PATH strips that prefix from every
// request URL before comparing against SHELL_FILES (which are bare filenames).

const SW_VERSION    = 'cs-v2';
const CACHE_SHELL   = SW_VERSION + '-shell';    // long-lived HTML/CSS/JS
const CACHE_RUNTIME = SW_VERSION + '-runtime';  // dynamic pages + images
const OFFLINE_URL   = 'offline.html';

// Derive the base path once at SW startup.
// Local dev:     self.location.pathname = '/sw.js'      → BASE_PATH = '/'
// GitHub Pages:  self.location.pathname = '/CelikSense_AI/sw.js' → BASE_PATH = '/CelikSense_AI/'
const BASE_PATH = self.location.pathname.replace(/sw\.js$/, '');

// All files that must be pre-cached at install time.
const SHELL_FILES = [
  'index.html',
  'dashboard.html',
  'profile.html',
  'settings.html',
  'reading-companion.html',
  'ocr-agent.html',
  'blind-audio.html',
  'sign-language.html',
  'sign-dictionary.html',
  'adhd-agent.html',
  'dyslexia-agent.html',
  'ai-librarian.html',
  'ai-teacher-agent.html',
  'personalisation-agent.html',
  'early-warning.html',
  'intervention.html',
  'teacher-dashboard.html',
  'pilot-evidence.html',
  'competition-dashboard.html',
  'demo-script.html',
  'user-validation.html',
  'book-discovery.html',
  'offline-library.html',
  'offline.html',
  'evidence-summary.html',
  'shared.js',
  'styles.css',
  'voice-system.js',
  'braille-system.js',
  'bim-avatar.js',
  'avatar-creator.js',
  'personalisation-system.js',
  'avatar-engine.js',
  'providers/heygen-provider.js',
  'providers/did-provider.js',
  'providers/nvidia-provider.js',
  'providers/rpm-provider.js',
  'demo-mode.js',
  'manifest.json',
];

// Max entries in runtime cache (LRU eviction).
const RUNTIME_MAX = 60;

// ── IndexedDB helpers (shared with main thread via postMessage) ──────────────
const IDB_NAME    = 'celiksense-idb';
const IDB_VERSION = 2;

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onerror   = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('downloads')) {
        const s = db.createObjectStore('downloads', { keyPath: 'id' });
        s.createIndex('savedAt', 'savedAt');
      }
      if (!db.objectStoreNames.contains('ocr_cache')) {
        db.createObjectStore('ocr_cache', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('ai_cache')) {
        db.createObjectStore('ai_cache', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        const sq = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        sq.createIndex('ts', 'ts');
      }
    };
  });
}

function idbPut(storeName, item) {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  });
}

function idbGetAll(storeName) {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = () => reject(req.error);
    });
  });
}

function idbDelete(storeName, key) {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).delete(key);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  });
}

function idbClear(storeName) {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).clear();
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  });
}

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then(cache => {
      return Promise.allSettled(
        SHELL_FILES.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Cannot cache', url, err))
        )
      );
    }).then(() => {
      console.log('[SW] Install complete — shell cached.');
      return self.skipWaiting();
    })
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_SHELL && k !== CACHE_RUNTIME)
          .map(k => { console.log('[SW] Removing old cache:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
     .then(() => console.log('[SW] Activate complete.'))
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-same-origin requests (CDNs, Gemini API, etc.)
  if (url.origin !== self.location.origin) return;

  // Strip base path so '/CelikSense_AI/dashboard.html' → 'dashboard.html'
  const relPath = url.pathname.startsWith(BASE_PATH)
    ? url.pathname.slice(BASE_PATH.length)
    : url.pathname.replace(/^\//, '');
  const path = relPath || 'index.html';
  const isShell = SHELL_FILES.includes(path) || SHELL_FILES.includes(path + '.html');

  event.respondWith(
    isShell
      ? cacheFirstStrategy(event.request)
      : networkFirstStrategy(event.request)
  );
});

// Cache-first: return cached shell file, update in background.
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request, { cacheName: CACHE_SHELL });
  if (cached) {
    // Background update
    fetch(request).then(res => {
      if (res && res.status === 200) {
        caches.open(CACHE_SHELL).then(c => c.put(request, res));
      }
    }).catch(() => {});
    return cached;
  }
  // Not in shell — try network
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      caches.open(CACHE_SHELL).then(c => c.put(request, res.clone()));
    }
    return res;
  } catch {
    if (request.mode === 'navigate') return serveFallback();
    return new Response('Offline', { status: 503 });
  }
}

// Network-first: try network, fall back to runtime cache.
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_RUNTIME);
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      await pruneRuntimeCache(cache);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return serveFallback();
    return new Response('Offline', { status: 503 });
  }
}

async function serveFallback() {
  const shell = await caches.open(CACHE_SHELL);
  const fallback = await shell.match(OFFLINE_URL);
  if (fallback) return fallback;
  return new Response(
    '<html><body><h1>CelikSense AI — Offline</h1><p>Page not cached. Please reconnect.</p></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

async function pruneRuntimeCache(cache) {
  const keys = await cache.keys();
  if (keys.length >= RUNTIME_MAX) {
    // Delete oldest entries (FIFO)
    for (let i = 0; i < keys.length - RUNTIME_MAX + 1; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// ── Message handler ────────────────────────────────────────────────────────────
// Main thread communicates with the SW via postMessage to store/retrieve content.
self.addEventListener('message', event => {
  const data = event.data || {};

  switch (data.type) {

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_CONTENT':
      // Store arbitrary text content in the downloads IDB store.
      idbPut('downloads', {
        id:          data.id          || ('dl-' + Date.now()),
        title:       data.title       || 'Untitled',
        text:        data.text        || '',
        source:      data.source      || 'unknown',
        legalStatus: data.legalStatus || 'unknown',
        savedAt:     data.savedAt     || Date.now(),
        size:        (data.text || '').length,
      }).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(err => {
        console.error('[SW] CACHE_CONTENT error:', err);
        event.ports[0] && event.ports[0].postMessage({ ok: false, error: String(err) });
      });
      break;

    case 'CACHE_OCR':
      idbPut('ocr_cache', {
        id:      data.id      || ('ocr-' + Date.now()),
        title:   data.title   || 'OCR Scan',
        text:    data.text    || '',
        savedAt: data.savedAt || Date.now(),
        size:    (data.text || '').length,
      }).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(err => {
        event.ports[0] && event.ports[0].postMessage({ ok: false, error: String(err) });
      });
      break;

    case 'CACHE_AI':
      idbPut('ai_cache', {
        key:     data.key     || ('ai-' + Date.now()),
        prompt:  data.prompt  || '',
        response:data.response|| '',
        savedAt: data.savedAt || Date.now(),
      }).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: false });
      });
      break;

    case 'GET_DOWNLOADS':
      idbGetAll('downloads').then(items => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items: [] });
      });
      break;

    case 'GET_OCR_CACHE':
      idbGetAll('ocr_cache').then(items => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items: [] });
      });
      break;

    case 'GET_AI_CACHE':
      idbGetAll('ai_cache').then(items => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items: [] });
      });
      break;

    case 'REMOVE_DOWNLOAD':
      idbDelete('downloads', data.id).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: false });
      });
      break;

    case 'REMOVE_OCR':
      idbDelete('ocr_cache', data.id).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: false });
      });
      break;

    case 'ADD_SYNC_ITEM':
      idbPut('sync_queue', {
        type:  data.itemType || 'progress',
        data:  data.itemData || {},
        ts:    Date.now(),
      }).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: false });
      });
      break;

    case 'GET_SYNC_QUEUE':
      idbGetAll('sync_queue').then(items => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, items: [] });
      });
      break;

    case 'CLEAR_SYNC_QUEUE':
      idbClear('sync_queue').then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      }).catch(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: false });
      });
      break;

    case 'GET_CACHE_STORAGE_KEYS':
      caches.keys().then(keys => {
        event.ports[0] && event.ports[0].postMessage({ ok: true, keys });
      });
      break;
  }
});

// ── Background Sync ───────────────────────────────────────────────────────────
// Fires when connectivity is restored (Chrome/Edge; ignored elsewhere).
self.addEventListener('sync', event => {
  if (event.tag === 'cs-progress-sync') {
    event.waitUntil(
      idbGetAll('sync_queue').then(items => {
        if (!items.length) return;
        // Prototype: log the queue — replace with real fetch() when backend exists.
        console.log('[SW] Background sync — items to push:', items.length);
        // Notify all open clients that sync is happening.
        return self.clients.matchAll().then(clients => {
          clients.forEach(c => c.postMessage({ type: 'SYNC_STARTED', count: items.length }));
        });
        // Real implementation: return fetch('/api/sync', { method:'POST', body:JSON.stringify(items) })
        //   .then(() => idbClear('sync_queue'));
      })
    );
  }
});
