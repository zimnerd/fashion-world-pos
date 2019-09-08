FROM php:7.3-fpm

# PHP extensions

RUN apt-get update && apt-get install -y libpq-dev git unzip dnsutils

RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql

WORKDIR /usr/src/app

COPY oauth-private.key /var/www/html/storage/oauth-private.key
COPY oauth-public.key /var/www/html/storage/oauth-public.key

RUN git clone https://jolsen_neslotech:4EyBYMmyjV%40@gitlab.com/neslotech-devs/fashion-world-pos.git -v

ADD ./docker/php/php.ini /usr/local/etc/php/conf.d/php.ini
ADD ./docker/php/composer /bin/
RUN cp -r /usr/src/app/fashion-world-pos/* /var/www/html
COPY app-data/ /var/www/html/app-data
COPY app-data/ /var/www/html/app-data

RUN chown -R www-data:www-data /var/www

WORKDIR /var/www/html

ADD vendor.zip .

RUN unzip vendor.zip


