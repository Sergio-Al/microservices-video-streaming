# Microservices Video Streaming

This is an awesome microservices based project

## Requirements

- Node JS v16
- Docker
- Docker compose
- A remote storage with the name of a video (azure storage, aws s3, etc).

## Installation

You need install dependencies in each folder (each folder is a different application).

```
npm install
```

You also need a `docker-compose.yml` file with the following content

```
version: '3'
services:
  db:
    image: mongo:4.2.8
    container_name: db
    ports:
      - "4000:27017"
    restart: always
  azure-storage:
    image: azure-storage
    build: 
      context: ./azure-storage
      dockerfile: Dockerfile
    container_name: video-storage

    ports: 
     - "4001:80"
    environment:
      - PORT=80
      - STORAGE_ACCOUNT_NAME=<your-storage-name>
      - STORAGE_ACCESS_KEY=<your-storage-access-key>
    restart: "no"
  video-streaming:
    image: video-streaming
    build:
      context: ./video-streaming
      dockerfile: Dockerfile
    container_name: video-streaming
    ports:
      - "4002:80"
    environment:
      - PORT=80
      - DBHOST=mongodb://db:27017
      - DBNAME=video-streaming
      - VIDEO_STORAGE_HOST=video-storage
      - VIDEO_STORAGE_PORT=80
    restart: "no"
```

Now you can run the project

```
docker-compose up --build
```
