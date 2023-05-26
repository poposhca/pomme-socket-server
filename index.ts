import { Server } from "socket.io";
import Events from "./Domain/events";

const io = new Server({ /* options */ });

io.on(Events.connection, (socket) => {
    console.log("a user connected");
    console.log(socket.handshake.headers);

    socket.on("test", (msg) => {
        console.log("test", msg);
        socket.emit("testres", { msg: "testres" });
    });

    socket.on(Events.disconnect, () => {
        console.log("user disconnected");
    });
});

io.listen(3000);
