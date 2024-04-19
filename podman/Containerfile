FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli@17
RUN npm cache clean --force
RUN rm -rf ./node_modules
RUN cd /app && npm install --force

EXPOSE 4200

ENTRYPOINT ["npm", "run"]
CMD ["start"]