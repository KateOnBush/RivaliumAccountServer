FROM node:18.18

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 1840/tcp

CMD ["npm", "start:production"]
