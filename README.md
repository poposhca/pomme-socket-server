# POMME SOCKET SERVER

## Description

This is the socket server for the POMME project to handle real time quiz interaction.

## Installation

* Install the dependencies with `npm install`

### Redis

There is a docker file inside the [TestsUtils](./TestUtils) folder that can be used to start a redis server.

### Environment variables
See the [.env.example](./.env.example) file for the environment variables that need to be set.
* `PORT` The server Port
* `CORS_ORIGIN` The allowed origin for the server
* `REDIS_PORT` The port of the redis server
* `REDIS_PORT` The port of the redis server
* `REDIS_USER` The user of the redis server
* `REDIS_PASSWORD` The password of the redis server
