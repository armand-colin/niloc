FROM node:21-bullseye-slim

WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install

COPY src src
RUN npm run build

CMD ["node", "dist/main.js"]