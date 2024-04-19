import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { SocketioService } from 'src/app/services/socketio/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

    gameId: string;
    socketId = '';

    settingsFormControl = new FormGroup({
        numberOfBoards: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(20)]),
        startingNumberOfMines: new FormControl(8, [Validators.required, Validators.min(1), Validators.max(80)])
    });
    numberOfBoards = this.settingsFormControl.get('numberOfBoards');
    startingNumberOfMines = this.settingsFormControl.get('startingNumberOfMines');

    boardCounter = [0, 0];
    numberOfMines = [this.startingNumberOfMines.value, this.startingNumberOfMines.value];
    rowSize = [10, 10];
    playersInfo = [];
    playerId = -1;
    playersCells = [];
    subscribeTimer: Subscription;
    startingTimer = 3;
    gameStarted = false;
    gameStarting = false;
    playerJoined = false;
    gameFinished = true;
    hasWon = [false, false];
    isPlayable = [true, true];
    isFirstClick = [true, true];

    @ViewChildren(GameComponent) boards: QueryList<GameComponent>;


    constructor(
        private socketIoService: SocketioService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        private localStorage: LocalService
    ) { }

    ngOnInit(): void {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.socketIoService.connect(this.gameId, { name: this.localStorage.getData('name') });

        this.receiveGameJoin();
        this.receiveGameStart();
        this.receiveGameUpdate();
        this.receiveNewBoard();
    }

    ngAfterViewInit() {
        this.boards.changes.subscribe((data: any) => {
            this.assignBoards();
        });
    }

    ngOnDestroy(): void {
        this.socketIoService.leaveGame(this.gameId);
    }

    gameStart() {
        this.socketIoService.gameStart(this.gameId, { numberOfBoards: this.numberOfBoards.value, startingNumberOfMines: this.startingNumberOfMines.value });
    }

    reset() {
        if (!!this.subscribeTimer) this.subscribeTimer.unsubscribe();
        this.gameStarting = true;
        this.isPlayable[0] = this.isPlayable[1] = false;
        this.rowSize = [10, 10];
        this.boardCounter = [0, 0];
        this.numberOfMines[0] = this.numberOfMines[1] = this.startingNumberOfMines.value;
        this.gameFinished = false;
        this.hasWon[0] = this.hasWon[1] = false;
        this.isFirstClick[0] = this.isFirstClick[1] = true;


        /* let timerAudio = new Audio();
        timerAudio.src = '../../assets/sounds/race_timer.mp3';
        timerAudio.load();
        timerAudio.muted = true;
        timerAudio.muted = false;
        var resp = timerAudio.play();
        if (resp!== undefined) {
            resp.then(() => {}).catch(error => {});
        }
        else console.log('resp is undefined') */

        this.subscribeTimer = timer(0, 1000).subscribe(val => {
            this.startingTimer = 3 - val;
            if (val == 3) {
                this.subscribeTimer.unsubscribe();
                this.gameStarting = false;
                this.isPlayable[0] = this.isPlayable[1] = true;
            }
        });
    }

    gameUpdate(event, boardId) {
        if (this.playerId != boardId) return;
        event.boardId = boardId;

        if (this.isFirstClick[boardId] && event.type === 'checkCell') this.socketIoService.newBoard(this.gameId, { boardId: boardId, mines: this.numberOfMines[boardId], firstClick: event.cell });
        this.socketIoService.gameUpdate(this.gameId, event);
    }

    async won(event, boardId) {
        this.hasWon[boardId] = true;

        if (this.playersCells[boardId][this.boardCounter[boardId] + 1] == undefined) {
            this.isPlayable[0] = this.isPlayable[1] = false;
            this.gameFinished = true;
            return;
        }

        this.isPlayable[boardId] = false;
        await this.sleep(2000);

        Object.assign(this.boards.toArray()[boardId].board, this.boards.toArray()[boardId].newBoard(this.numberOfMines[boardId] + 1, this.playersCells[boardId][this.boardCounter[boardId] + 1]));
        this.boardCounter[boardId]++;
        this.numberOfMines[boardId]++;

        this.hasWon[boardId] = false;
        this.isFirstClick[boardId] = true;
        this.isPlayable[boardId] = true;
    }

    async lost(event, boardId) {
        this.isPlayable[boardId] = false;
        await this.sleep(1000);
        if (boardId == this.playerId) this.socketIoService.newBoard(this.gameId, { boardId: boardId, mines: this.numberOfMines[boardId] });
    }

    receiveGameJoin() {
        this.socketIoService.receiveGameJoin().subscribe((data: any) => {
            if (!environment.production) console.log('receiveGameJoin', data);
            if (this.socketId === '') this.socketId = data.socketId;
            if (data.sockets.length === 1) return;

            this.playerId = data.sockets.findIndex(socket => socket.id === this.socketId);
            for (let i = 0; i < data.sockets.length; i++) this.playersInfo.push({ id: i, name: data.sockets[i].name });

            let message = '';
            message = data.sockets.length - 1 == this.playerId ? `You joined ${data.sockets[0].name}'s game!` : `${data.sockets[data.sockets.length - 1].name} has joined the game!`;
            this.snackbar.open(message, '', {
                duration: 3000,
            });

            if (this.playerId == 0) this.playerJoined = true;
        });
    }

    receiveGameStart() {
        this.socketIoService.receiveGameStart().subscribe((data: any) => {
            if (!environment.production) console.log('receiveGameStart', data);
            this.gameStarted = true;

            if (this.playerId != 0) {
                this.numberOfBoards.disable();
                this.startingNumberOfMines.disable();
            }

            this.numberOfBoards.setValue(data.numberOfBoards);
            this.startingNumberOfMines.setValue(data.startingNumberOfMines);
            this.reset();
            this.playersCells = data.cells;

            if (this.boards.toArray().length != 0) this.assignBoards();
        });
    }

    receiveGameUpdate() {
        this.socketIoService.receiveGameUpdate().subscribe((data: any) => {
            if (!environment.production) console.log('receiveGameUpdate', data);
            if (data.type === 'checkCell') this.boards.toArray()[data.boardId].checkCell(data.cell, true);
            else if (data.type === 'flag') this.boards.toArray()[data.boardId].flag(data.cell, true);
        });
    }

    receiveNewBoard() {
        this.socketIoService.receiveNewBoard().subscribe((data: any) => {
            if (!environment.production) console.log('receiveNewBoard', data);
            Object.assign(this.boards.toArray()[data.boardId].board, this.boards.toArray()[data.boardId].newBoard(null, data.cells));

            this.isFirstClick[data.boardId] = !this.isFirstClick[data.boardId];
            this.isPlayable[data.boardId] = true;
        });
    }

    assignBoards() {
        Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.playersCells[0][0]));
        Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.playersCells[1][0]));
    }

    settingsFormatter(setting, max) {
        if (!!setting.value) {
            setting.setValue(Math.abs(setting.value));
            if (setting.value > max) setting.setValue(max);
        }
        else setting.setValue(null);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
