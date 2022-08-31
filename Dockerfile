FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

ENV APP_PORT=3000

ENV LINE_CLIENT_ID=1657377844
ENV LINE_CLIENT_SECRET=829a1c9dea13e420d88d4dd4f9d3962a
ENV LINE_ME_URL=https://access.line.me/oauth2/v2.1
ENV LINE_ME_URL_TOKEN=https://api.line.me/oauth2/v2.1
ENV LINE_ENDPOIN=https://meauth.net

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]