FROM nginx:alpine AS web

WORKDIR /usr/share/nginx/html

COPY ./public/ ./