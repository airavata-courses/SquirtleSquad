FROM node:carbon

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

RUN npm install nodemon

COPY . .
EXPOSE 8081
CMD ["npm", "run", "dev" ]
