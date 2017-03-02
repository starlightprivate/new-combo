FROM node:6.9.4

RUN mkdir -p /app
ADD . /app

WORKDIR /app
RUN npm install
RUN npm run frontend

CMD ["npm","start"]