FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock .
RUN yarn
COPY . .
# overwrite env file for docker.
COPY .env.docker .env.local 
EXPOSE 3000
CMD [ "yarn", "start"]