FROM node:12.18.1-alpine3.10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --ony=production
COPY ./src ./src
CMD npm start