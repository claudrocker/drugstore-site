FROM node:8
WORKDIR /app
COPY src/package.json /app
RUN npm install
COPY ./src /app
CMD node server.js
EXPOSE 8000
