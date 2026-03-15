import { createVerifiedFetch } from '@helia/verified-fetch';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));
self.addEventListener('fetch', (() => {
    let vFetch;
    return (event) => {
        const url = new URL(event.request.url);
        const isSameOrigin = url.origin === self.location.origin;
        if (isSameOrigin) {
            event.respondWith((async () => {
                if (!vFetch) vFetch = await createVerifiedFetch();
                const p2pUrl = `ipns://${self.location.hostname}${url.pathname}${url.search}${url.hash}`;
                return await vFetch(p2pUrl);
            })());
        }
    };
})());