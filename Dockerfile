FROM node:12.16.3-alpine3.9

WORKDIR /usr/app

COPY package.json .
COPY .babelrc .

RUN npm i
RUN apk update && apk add bash

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
