FROM node:18
LABEL authors="joaquinpopoca"
WORKDIR /app
ENV PORT=8080
ENV CORS_ORIGIN="http://localhost:5173"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE $PORT
CMD ["npm", "start"]
