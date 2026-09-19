
FROM node:24-alpine AS builder
WORKDIR /app
COPY ./tpcropapp/package*.json ./
RUN npm ci || npm install
COPY ./tpcropapp ./
ENV VITE_API_URL=/api
ENV VITE_PAGE_SIZE=9
RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
