# Stage 0, based on Node.js, to build and compile Angular
FROM node:gallium as node

WORKDIR /app

COPY package*.json ./app/

COPY ./ /app/

RUN npm install

ENV env=prod

# RUN npm run build -- --prod --environment $env
RUN npm run build  --production

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13

COPY --from=node /app/dist/ /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
