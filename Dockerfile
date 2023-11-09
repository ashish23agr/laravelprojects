FROM php:8.1-fpm-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

RUN apk update && apk add --update nodejs npm \
    composer php-pdo_sqlite php-pdo_mysql php-pdo_pgsql php-simplexml php-fileinfo php-dom php-tokenizer php-xml php-xmlwriter php-session \
    openrc bash nginx

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

COPY --chown=www-data:www-data web /app
WORKDIR /app

# Overwrite default nginx config
COPY web/nginx.conf /etc/nginx/nginx.conf

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN composer install

RUN chown www-data:www-data /app/nginx.conf

RUN cd frontend && npm install && npm run build
RUN composer build
RUN pwd

RUN mkdir bootstrap || true
RUN mkdir bootstrap/cache || true
RUN mkdir storage || true
RUN mkdir storage/framework || true
RUN cd storage/framework && mkdir sessions views cache || true

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

RUN tail -100 /app/storage/logs/laravel.log
RUN cat /app/storage/logs/laravel.log
