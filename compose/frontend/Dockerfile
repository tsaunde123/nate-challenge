FROM node:14

WORKDIR /app

COPY ./frontend/package.json /app

RUN yarn install

COPY ./frontend /app

EXPOSE 3000