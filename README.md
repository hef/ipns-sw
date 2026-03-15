IPNS Service Worker
===================

Make an ipfs backed domain work on browsers that don't support ipfs/ipns.

How To Use
----------

* Have an IPFS site you want to host on a traditional domain.
* Setup [dnslink](https://docs.ipfs.tech/concepts/dnslink/#publish-content-path) for your site by setting up the relevant txt records in dns.
* Use the container image at `ghcr.io/hef/ipns-sw` to host your site.

You still need https setup correctly for this to work, that is a requirement of web service workers.

The service worker intercepts fetch calls to e.g. `https://<your domain>` and rewrites them to be `ipns://<your domain>` and then does the ipfs resolving.

License
-------

MIT License - see [LICENSE](LICENSE) file for details. 