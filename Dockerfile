FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN apt update
RUN npm install -g yarn
RUN yarn 
COPY ./ .
RUN yarn build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf