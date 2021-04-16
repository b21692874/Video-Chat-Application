const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


let users = {};
let representatives = {};
let mesgulTemsilci = {};

io.of("/representative").on('connection', (socket) => {
    if (!representatives[socket.id]) {
        representatives[socket.id] = socket.id;
    }
   
    socket.emit("yourID", socket.id);

    socket.on("acceptCall", (data) => {
        io.of('/clients').to(data.to).emit('callAccepted', data.signal);
    })

    socket.on("busy", (data) => {
        if (!mesgulTemsilci[data.from]){
            mesgulTemsilci[data.from] = data.from;
        }
        io.of('/clients').emit('busyy', mesgulTemsilci);
    })

    socket.on('disconnect', () => {
        delete representatives[socket.id];
        delete mesgulTemsilci[socket.id];
    })
});

clients = io.of("/clients");
clients.on('connection', (socket) => {
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);

    socket.emit("temsilciler", representatives);
    socket.emit("mesgulTemsilciler", mesgulTemsilci);

    socket.on('disconnect', () => {
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.of('/representative').to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })
});

server.listen(8000, () => console.log('server is running on port 8000'));


