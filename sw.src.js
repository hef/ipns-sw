import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { httpGatewayRouting, libp2pRouting } from '@helia/routers';
import { createHelia, libp2pDefaults } from 'helia';
import { createLibp2p } from 'libp2p';
import { createVerifiedFetch } from '@helia/verified-fetch';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';

const GATEWAYS = [
    'https://trustless-gateway.link',
    'https://dweb.link',
    'https://w3s.link',
    'https://nftstorage.link',
    'https://4everland.io',
];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));
self.addEventListener('fetch', (() => {
    let vFetchPromise;
    function getVFetch() {
        if (!vFetchPromise) {
            vFetchPromise = (async () => {
                const blockstore = new IDBBlockstore('helia/blocks');
                const datastore = new IDBDatastore('helia/data');
                await blockstore.open();
                await datastore.open();

                const libp2p = await createLibp2p(libp2pDefaults());

                const helia = await createHelia({
                    blockstore,
                    datastore,
                    libp2p,
                    blockBrokers: [
                        bitswap(),
                        trustlessGateway(),
                    ],
                    routers: [
                        libp2pRouting(libp2p),
                        httpGatewayRouting({ gateways: GATEWAYS }),
                    ],
                });

                return createVerifiedFetch(helia);
            })();
        }
        return vFetchPromise;
    }
    return (event) => {
        const url = new URL(event.request.url);
        const isSameOrigin = url.origin === self.location.origin;
        if (isSameOrigin) {
            event.respondWith((async () => {
                const vFetch = await getVFetch();
                const p2pUrl = `ipns://${self.location.hostname}${url.pathname}${url.search}${url.hash}`;
                return vFetch(p2pUrl);
            })());
        }
    };
})());
