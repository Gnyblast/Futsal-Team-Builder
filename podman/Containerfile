FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli@17
RUN npm cache clean --force
RUN npm update
RUN npm install --force

EXPOSE 4200

ENTRYPOINT ["npm", "run"]
CMD ["start"]