FROM node:20-alpine
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.21.3-alpine
ENV ROOT_PREFIX=admin
RUN mkdir /usr/share/nginx/html/data
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 ./dist/ /usr/share/nginx/html/${ROOT_PREFIX}
