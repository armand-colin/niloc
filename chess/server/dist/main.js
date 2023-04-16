"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const niloc_socketio_server_1 = require("niloc-socketio-server");
const niloc_core_1 = require("niloc-core");
const PORT = 3456;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: "*",
        allowedHeaders: "*"
    }
});
const network = new niloc_socketio_server_1.SocketIONetwork();
const application = new niloc_core_1.Application("SERVER", network);
// For now we suppose we only have 1 room
io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId;
    if (typeof peerId !== "string") {
        socket.disconnect(true);
        return;
    }
    network.addSocket(socket);
    application.send(niloc_core_1.Address.broadcast(), { connected: peerId });
});
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
