FROM node:14-alpine
RUN mkdir -p /user/app
RUN chmod -R 777 /user/app
WORKDIR /user/app
COPY package*.json /user/app
COPY tsconfig*.json /user/app
RUN npm install
COPY . /user/app

EXPOSE 3000
CMD [ "npm", "start" ]