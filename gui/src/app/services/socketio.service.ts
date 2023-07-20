import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketioService {


    socket: Socket;

    constructor() { }

    connect(gameId) {
        this.socket = io('http://localhost:3000');
        this.socket.emit('gameJoin', { gameId: gameId });
    }

    gameStart(gameId) {
        this.socket.emit('gameStart', { gameId: gameId });
    }

    gameUpdate(gameId, data) {
        this.socket.emit('gameUpdate', { gameId: gameId, data: data });
    }

    newBoard(gameId, data) {
        this.socket.emit('newBoard', { gameId: gameId, data: data });
    }

    receiveGameJoin() {
        return new Observable(o => {
            this.socket.on('gameJoin', message => {
                o.next(message);
            });
        });
    }

    receiveGameStart() {
        return new Observable(o => {
            this.socket.on('gameStart', data => {
                o.next(data);
            });
        });
    }

    receiveGameUpdate() {
        return new Observable(o => {
            this.socket.on('gameUpdate', data => {
                o.next(data);
            });
        });
    }

    receiveNewBoard() {
        return new Observable(o => {
            this.socket.on('newBoard', data => {
                o.next(data);
            });
        });
    }
}
