FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install
RUN npm install

COPY . .

# Build
RUN npm run build

# Run
ENTRYPOINT ["node", "dist/lookup-cli.js"]