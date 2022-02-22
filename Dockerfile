# Stage 0, based on Node.js, to build and compile Angular

FROM node:gallium as node

ARG env=dev

WORKDIR /app

COPY package*.json ./app/

COPY ./ /app/

RUN npm install

ENV environment ${env}

RUN  npm run  build -- --configuration=${environment}

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13

COPY --from=node /app/dist/ /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
