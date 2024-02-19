import * as express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { createClient } from "redis";
import Events from "./domain/Events";
import JoinQuizMessage from "./domain/JoinQuizMessage";
import SetQuizPosition from "./domain/SetQuizPosition";
import SendAnswersMessage from "./domain/SendAnswersMessage";
import ReceiveAnswerMessage from "./domain/ReceiveAnswerMessage";
import { PORT, CORS_ORIGIN } from "./config";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors: {
        origin: CORS_ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
        credentials: true
    }
});

// SET REDIS CONNECTION

const redisPubClient = createClient({
    url:'redis://localhost:6379'
});

redisPubClient.on("error", (error) => {
    console.log("Error!!!!");
    console.error(error.message);
});

// SET EVENT LISTENERS

io.on(Events.connection, (socket) => {
    const userToken = socket.handshake.headers.authorization;
    console.log(`User ${userToken} connected`);

    socket.on(Events.joinQuiz, (msg: JoinQuizMessage) => {
        const room = `${msg.quizId}-${msg.adminId}`;
        socket.join(room);
        console.log(`user ${userToken} joined room ${room}`);
        //TODO: Persist room to volatile database?
    });

    socket.on(Events.setQuizPosition, (msg: SetQuizPosition) => {
        //TODO: Validate userToken admin role to use its Token
        const room = `${msg.quizId}-${userToken}`;
        console.log(`user set quiz position in room ${room}`);
        io.emit(Events.sendQuizPosition, msg.position);
    });

    socket.on(Events.sendAnswers, (msg: SendAnswersMessage) => {
        console.log(`user ${userToken} sent answers ${msg.answers}`);
        //TODO: add validation to send only to admin host
        const adminMsg: ReceiveAnswerMessage = {
            userId: userToken,
            answers: msg.answers,
        };
        console.log(`sending ${Events.receiveAnswer} to admin ${JSON.stringify(adminMsg)}`);
        io.sockets.emit(Events.receiveAnswer, adminMsg);
    });

    socket.on(Events.disconnect, () => {
        console.log(`User ${userToken} disconnected`);
    });
});

// SET HTTP SERVER
Promise.all([redisPubClient.connect()]).then(() => {
    io.adapter(createAdapter(redisPubClient));
    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });
    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
    httpServer.listen(PORT, () => {
        console.log(`POMME Socket Server listening on port: ${PORT}\nCORS origin config: ${CORS_ORIGIN}`);
    });
});
