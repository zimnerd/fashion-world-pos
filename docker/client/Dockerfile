FROM node:8.11.2-alpine as node

RUN apk --no-cache add git curl

WORKDIR /usr/src

RUN git clone https://jolsen_neslotech:4EyBYMmyjV%40@gitlab.com/neslotech-devs/fashion-world-pos.git -v

WORKDIR /usr/src/app

RUN cp /usr/src/fashion-world-pos/client/package*.json ./

RUN npm install

RUN cp -r /usr/src/fashion-world-pos/client/* ./

RUN npm run build -- --production

# Stage 2
FROM nginx:latest

COPY --from=node /usr/src/app/build /usr/share/nginx/html
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf
