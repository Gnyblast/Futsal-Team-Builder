FROM node:lts-alpine

WORKDIR /app
COPY . /var/app

RUN npm install -g @angular/cli@17
RUN npm cache clean --force
RUN rm -rf ./node_modules
RUN cd /var/app && npm install --force

EXPOSE 4200

ENTRYPOINT ["cp","-r", "/var/app/node_modules", "/app/node_modules","&&", "npm", "run"]
CMD ["start"]