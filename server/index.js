const Express = require('express')();
const httpServer = require('http').Server(Express);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ['*']
});

const { createAllBoards, createBoard } = require('./util/create-boards');


io.on('connection', socket => {
    console.log('A player has connected');

    socket.on('gameStart', ({ gameId, data }) => {
        io.to(gameId).emit('gameStart', { cells: createAllBoards(data.numberOfBoards, data.startingNumberOfMines), numberOfBoards: data.numberOfBoards, startingNumberOfMines: data.startingNumberOfMines });
        console.log('A new game is starting', data);
    });

    socket.on('gameJoin', ({ gameId, data }) => {
        socket.join(gameId);
        socket.name = data.name;

        let sockets = Array.from(io.sockets.adapter.rooms.get(gameId));
        sockets = sockets.map((id) => ({ id }));
        sockets.forEach(sock => {
            let result = Array.from(io.sockets.sockets).find(s => s[1].id === sock.id)[1].name;
            sock.name = result;
        });
        
        io.to(gameId).emit('gameJoin', { socketId: socket.id, sockets: sockets });
    });

    socket.on('gameUpdate', ({ gameId, data }) => {
        io.to(gameId).emit('gameUpdate', data);
    });

    socket.on('newBoard', ({ gameId, data }) => {
        io.to(gameId).emit('newBoard', { boardId: data.boardId, cells: createBoard(data.mines, data.firstClick || null) });
    });

    socket.on('leaveGame', ({ gameId }) => {
        socket.leave(gameId);
    });

    socket.on('sendMessage', ({ gameId, data }) => {
        io.to(gameId).emit('sendMessage', data );
    });
});


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});