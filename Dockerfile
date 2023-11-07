FROM php:8.1-fpm-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

RUN apk update && apk add --update nodejs npm \
    composer php-pdo_sqlite php-pdo_mysql php-pdo_pgsql php-simplexml php-fileinfo php-dom php-tokenizer php-xml php-xmlwriter php-session \
    openrc bash nginx

RUN docker-php-ext-install pdo

COPY --chown=www-data:www-data web /app
WORKDIR /app

# Overwrite default nginx config
COPY web/nginx.conf /etc/nginx/nginx.conf

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN composer install
RUN touch /app/storage/db.sqlite
RUN chown www-data:www-data /app/storage/db.sqlite

# Install MySQL client and other dependencies
RUN apt-get update \
    && apt-get install -y \
    default-mysql-client \
    && docker-php-ext-install mysqli pdo_mysql
	
# Set environment variables for MySQL connection
DB_CONNECTION=mysql
DB_HOST=dress.czpbozyec1yt.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=dress_maker
DB_USERNAME=root
DB_PASSWORD=meaQj6Qm41h4wRy9K729

RUN cd frontend && npm install && npm run build
RUN composer build

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
