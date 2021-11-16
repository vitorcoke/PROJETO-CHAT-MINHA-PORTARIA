"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInRom = exports.getUser = exports.removeUser = exports.addUser = void 0;
var users = [];
var addUser = function (_a) {
    var id = _a.id, name = _a.name, room = _a.room;
    name = name.trim();
    room = room.trim();
    var existingUser = users.find(function (user) { return user.room === room && user.name === name; });
    if (existingUser)
        return { error: 'Nome de Usuário já existe!.' };
    var user = { id: id, name: name, room: room };
    users.push(user);
    return { user: user };
};
exports.addUser = addUser;
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
var getUser = function (id) { return users.find(function (user) { return user.id === id; }); };
exports.getUser = getUser;
var getUserInRom = function (room) { return users.filter(function (user) { return user.room === room; }); };
exports.getUserInRom = getUserInRom;
