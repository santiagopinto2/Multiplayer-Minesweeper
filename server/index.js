const Express = require('express')();
const httpServer = require('http').Server(Express);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ['*']
});

const { createAllBoards, createBoard } = require('./util/create-boards');


io.on('connection', socket => {
    console.log('A player has connected ');

    socket.on('gameStart', ({ gameId }) => {
        io.to(gameId).emit('gameStart', createAllBoards());
        console.log('A new game is starting');
    });

    socket.on('gameJoin', ({ gameId }) => {
        socket.join(gameId);
        console.log('A player has joined the game ' + gameId);
        socket.to(gameId).emit('gameJoin', 'A player has joined the game!');
    });

    socket.on('gameUpdate', ({ gameId, data }) => {
        socket.to(gameId).emit('gameUpdate', data);
    });

    socket.on('newBoard', ({ gameId, data }) => {
        io.to(gameId).emit('newBoard', { boardId: data.boardId, cells: createBoard(data.mines) });
    });
});


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});