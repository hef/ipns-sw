IPNS Service Worker
===================

Make an ipfs backed domain work on browsers that don't support ipfs/ipns.

How To Use
----------

* Setup [dnslink](https://docs.ipfs.tech/concepts/dnslink/#publish-content-path) for your site.  Make sure your site would work on a browser that does support ipfs/ipns.
* Use the container image at `ghcr.io/hef/ipns-sw` to host your site.

You still need https setup correctly for this to work, that is a requirement of web service workers.

Internally, the service worker intercepts fetch calls to e.g. `https://<your domain>` and rewrites them to be `ipns://<your domain>` and then does the ipfs resolving. 