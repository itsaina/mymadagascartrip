FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

ENV PORT=80
EXPOSE 80

CMD sed -i "s/listen       80;/listen       ${PORT:-80};/g" /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"
