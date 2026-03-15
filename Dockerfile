FROM docker.io/library/node:alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY sw.src.js ./
RUN npm run build

FROM docker.io/library/nginx:alpine
LABEL org.opencontainers.image.title="ipns-sw"
LABEL org.opencontainers.image.description="IPNS service worker proxy"
LABEL org.opencontainers.image.vendor="hef"
COPY --from=builder /app/sw.js /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
