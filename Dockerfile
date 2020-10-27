FROM node:10.13
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
RUN cd client && npm install @angular/cli && npm install && npm run build
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]