import * as express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import adapters from "./adapters";
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

// SET EVENT LISTENERS

io.on(Events.connection, (socket) => {
    const userToken = socket.handshake.headers.authorization;
    console.log(`User ${userToken} connected`);

    socket.on(Events.joinQuiz, (msg: JoinQuizMessage) => {
        const room = `${msg.quizId}-${msg.adminId}`;
        socket.join(room);
        console.log(`user ${userToken} joined room ${room}`);
        adapters.dbAdapter.readStream({ quizStartTime: 1708374578733 });
    });

    socket.on(Events.setQuizPosition, (msg: SetQuizPosition) => {
        //TODO: Validate userToken admin role to use its Token
        const room = `${msg.quizId}-${userToken}`;
        console.log(`user set quiz position in room ${room}`);
        io.to(room).emit(Events.sendQuizPosition, msg.position);
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
adapters.dbAdapter.connect().then(() => {
    io.adapter(createAdapter(adapters.dbAdapter.dbInstance));
    httpServer.listen(PORT, () => {
        console.log(`POMME Socket Server listening on port: ${PORT}\nCORS origin config: ${CORS_ORIGIN}`);
    });

}).catch((error) => {
    console.error(`Error initiating server\N${error.message}`);
    process.exit(1);
});
