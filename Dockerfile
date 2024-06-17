FROM caddy:alpine
COPY ./src/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile