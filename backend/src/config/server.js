"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var users_1 = require("./users");
var app = (0, express_1.default)();
var httpServer = http_1.default.createServer(app);
var io = new socket_io_1.default.Server(httpServer, {
    cors: {
        origin: '*',
    }
});
var porta = 8081;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
io.on("connection", function (socket) {
    socket.on('join', function (_a, callback) {
        var name = _a.name, room = _a.room;
        var _b = (0, users_1.addUser)({ id: socket.id, name: name, room: room }), error = _b.error, user = _b.user;
        if (error)
            return socket.emit('error', error);
        socket.join(user === null || user === void 0 ? void 0 : user.room);
        io.to(user === null || user === void 0 ? void 0 : user.room).emit('getUser', {
            user: (0, users_1.getUserInRom)(user === null || user === void 0 ? void 0 : user.room)
        });
        callback();
    });
    socket.on('sendMessage', function (message) {
        var user = (0, users_1.getUser)(socket.id);
        io.to(user === null || user === void 0 ? void 0 : user.room).emit('message', { user: user === null || user === void 0 ? void 0 : user.name, text: message.text, time: message.time });
    });
    socket.on('disconnect', function (data) {
        var user = (0, users_1.removeUser)(socket.id);
        if (user) {
            io.to(user === null || user === void 0 ? void 0 : user.room).emit('getUser', {
                user: (0, users_1.getUserInRom)(user === null || user === void 0 ? void 0 : user.room)
            });
        }
    });
});
httpServer.listen(porta);
