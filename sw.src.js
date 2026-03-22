import { bootstrap } from '@libp2p/bootstrap';
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
                if (!vFetch) vFetch = await createVerifiedFetch({
                    gateways: [
                        'https://trustless-gateway.link',
                        'https://dweb.link',
                        'https://w3s.link',
                        'https://nftstorage.link',
                        'https://4everland.io',
                    ],
                    routers: [
                        'https://delegated-ipfs.dev',
                        'https://cid.contact',
                    ],
                    libp2pConfig: {
                        peerDiscovery: [
                            bootstrap({
                                list: [
                                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
                                    '/dnsaddr/va1.bootstrap.libp2p.io/p2p/12D3KooWKnDdG3iXw9eTFijk3EWSunZcFi54Zka4wmtqtt6rPxc8',
                                ],
                            }),
                        ],
                    },
                });
                const p2pUrl = `ipns://${self.location.hostname}${url.pathname}${url.search}${url.hash}`;
                return await vFetch(p2pUrl);
            })());
        }
    };
})());