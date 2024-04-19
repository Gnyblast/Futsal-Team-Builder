FROM node:lts-alpine

WORKDIR /app
COPY ../ ./

RUN npm install -g @angular/cli@17
RUN npm install

ENTRYPOINT npm run
CMD start