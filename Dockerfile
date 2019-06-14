FROM node:9

ENV CACHE_BUST=1234
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 8095
CMD [ "npm", "start" ]
