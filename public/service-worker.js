const CACHE_NAME = 'vacinum-v2'
const urlsToCache = [
  '/',
  '/index.html'
]

// Instala e faz cache dos recursos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
  self.skipWaiting()
})

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Estratégia: network first, cache como fallback
self.addEventListener('fetch', event => {
  // Ignora requisições não-GET e chamadas ao Supabase (sempre precisa de dados frescos)
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('supabase.co')) return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a resposta mais recente
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})

// Recebe push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Vacinum'
  const options = {
    body: data.body || 'Você tem uma notificação.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: { url: data.url || '/' }
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Abre o app ao clicar na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus()
      }
      return clients.openWindow(event.notification.data.url || '/')
    })
  )
})