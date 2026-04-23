FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build
RUN cp -r frontend/build backend/public

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "src/index.js"]