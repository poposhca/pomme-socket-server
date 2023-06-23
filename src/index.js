"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server({ /* options */});
io.on("connection", function (socket) {
    // ...
});
io.listen(3000);
