FROM node:16
RUN apt-get update -y && \
    apt-get install -y build-essential libsqlite3-dev
EXPOSE 3000
WORKDIR /app
COPY . .
