FROM node:lts-alpine

WORKDIR /app
COPY . /var/app
COPY ./scripts/entrypoint.sh /bin/entrypoint.sh

RUN npm install -g @angular/cli@17
RUN npm cache clean --force
RUN rm -rf ./node_modules
RUN cd /var/app && npm install --force

EXPOSE 4200

ENTRYPOINT ["/bin/entrypoint.sh"]
CMD ["start"]