FROM --platform=$BUILDPLATFORM docker.io/library/node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY sw.src.js ./
RUN npm run build
COPY index.html ./
RUN apk add --no-cache gzip brotli && \
    gzip -9 -k sw.js index.html && \
    brotli -9 -k sw.js index.html

FROM docker.io/library/nginx:1.27-alpine
RUN apk add --no-cache nginx-mod-http-brotli
LABEL org.opencontainers.image.title="ipns-sw"
LABEL org.opencontainers.image.description="IPNS service worker proxy"
LABEL org.opencontainers.image.vendor="hef"
COPY --from=builder /app/sw.js* /usr/share/nginx/html/
COPY --from=builder /app/index.html* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
