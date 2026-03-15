import { createVerifiedFetch } from '@helia/verified-fetch';
let vFetch;

async function initP2P() {
    if (vFetch) return vFetch;
    vFetch = await createVerifiedFetch();
    return vFetch;
}

export async function zFetch (url) {
    const fetcher = await initP2P();
    return await fetcher(url);
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    const isSameOrigin = url.origin === self.location.origin;
    if (isSameOrigin) {
        const key = 'ipns://hef.sh'
        const p2pUrl = `${key}${url.pathname}`;
        event.respondWith(zFetch(p2pUrl.toString()));
    }
});