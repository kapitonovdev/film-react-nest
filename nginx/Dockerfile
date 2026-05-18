FROM nginx:1.27-alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY 10-wait-for-frontend.sh /docker-entrypoint.d/10-wait-for-frontend.sh
RUN chmod +x /docker-entrypoint.d/10-wait-for-frontend.sh

EXPOSE 80
