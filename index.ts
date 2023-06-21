import { Server } from "socket.io";
import Events from "./Domain/events";
import JoinQuizMessage from "./Domain/JoinQuizMessage";
import SetQuizPosition from "./Domain/SetQuizPosition";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

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
        //TODO: Validate userToken admin role
        const room = `${msg.quizId}-${userToken}`;
        console.log(`user set quiz position in room ${room}`);
        socket.to(room).emit(Events.sendQuizPosition, msg.position);
    });

    socket.on(Events.disconnect, () => {
        console.log("user disconnected");
    });
});

io.listen(3000);
