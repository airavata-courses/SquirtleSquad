FROM node:carbon

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install nodemon

COPY . .

EXPOSE 8080
CMD ["npm", "run", "dev" ]
