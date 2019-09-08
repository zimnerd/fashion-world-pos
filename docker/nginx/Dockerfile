FROM nginx:latest

RUN apt-get update && apt-get install -y git

ADD ./docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/src/app

RUN git clone https://jolsen_neslotech:4EyBYMmyjV%40@gitlab.com/neslotech-devs/fashion-world-pos.git -v

WORKDIR /var/www/html

RUN cp -r /usr/src/app/fashion-world-pos/* /var/www/html
