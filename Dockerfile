FROM node:18.18

WORKDIR /app

EXPOSE 1840/tcp

CMD npm run start:production