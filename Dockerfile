FROM node:9

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 8090
CMD [ "npm", "start" ]
