"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var Events_1 = require("./domain/Events");
var config_1 = require("../config");
var io = new socket_io_1.Server({
    cors: {
        origin: config_1.CORS_ORIGIN,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "x-requested-with"],
        credentials: true,
    }
});
io.on(Events_1.default.connection, function (socket) {
    var userToken = socket.handshake.headers.authorization;
    console.log("User ".concat(userToken, " connected"));
    socket.on(Events_1.default.joinQuiz, function (msg) {
        var room = "".concat(msg.quizId, "-").concat(msg.adminId);
        socket.join(room);
        console.log("user ".concat(userToken, " joined room ").concat(room));
        //TODO: Persist room to volatile database?
    });
    socket.on(Events_1.default.setQuizPosition, function (msg) {
        //TODO: Validate userToken admin role to use its Token
        var room = "".concat(msg.quizId, "-").concat(userToken);
        console.log("user set quiz position in room ".concat(room));
        socket.to(room).emit(Events_1.default.sendQuizPosition, msg.position);
    });
    socket.on(Events_1.default.sendAnswers, function (msg) {
        console.log("user ".concat(userToken, " sent answers ").concat(msg.answers));
        //TODO: add validation to send only to admin host
        var adminMsg = {
            userId: userToken,
            answers: msg.answers,
        };
        console.log("sending ".concat(Events_1.default.receiveAnswer, " to admin ").concat(JSON.stringify(adminMsg)));
        io.sockets.emit(Events_1.default.receiveAnswer, adminMsg);
    });
    socket.on(Events_1.default.disconnect, function () {
        console.log("User ".concat(userToken, " disconnected"));
    });
});
io.listen(config_1.PORT);
console.log("Socket Server listening on port: ".concat(config_1.PORT, "\nCORS config: ").concat(config_1.CORS_ORIGIN));
