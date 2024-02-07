import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketioService {


    socket: Socket;

    constructor() { }

    connect(gameId, data) {
        this.socket = io(environment.serverUrl);
        this.socket.emit('gameJoin', { gameId: gameId, data: data });
    }

    gameStart(gameId, data) {
        this.socket.emit('gameStart', { gameId: gameId, data: data });
    }

    gameUpdate(gameId, data) {
        this.socket.emit('gameUpdate', { gameId: gameId, data: data });
    }

    newBoard(gameId, data) {
        this.socket.emit('newBoard', { gameId: gameId, data: data });
    }

    leaveGame(gameId) {
        this.socket.emit('leaveGame', { gameId: gameId });
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
