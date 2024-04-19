FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli@17
RUN npm install --force

EXPOSE 4200

ENTRYPOINT ["npm", "run"]
CMD ["start"]