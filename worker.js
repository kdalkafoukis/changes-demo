importScripts('https://unpkg.com/workbox-sw@2.1.2/build/importScripts/workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW()

workbox.router.registerRoute(new RegExp('.*'), workbox.strategies.staleWhileRevalidate())
workbox.router.registerRoute(new RegExp('^https://unpkg.com/'), workbox.strategies.staleWhileRevalidate())
workbox.router.registerRoute(new RegExp('^https://fonts.(googleapis|gstatic).com/'), workbox.strategies.staleWhileRevalidate())
