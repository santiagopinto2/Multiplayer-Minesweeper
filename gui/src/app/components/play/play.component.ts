import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    gameId: string;
    socket: any;
    rowSize = [10, 10];
    numberOfBoards = 1;
    startingNumberofMines = 2;
    numberOfMines = [this.startingNumberofMines, this.startingNumberofMines];
    playerId = 1;
    playersCells = [];
    gameStarted = false;
    playerJoined = false;
    gameFinished = true;
    hasWon = [false, false];
    isPlayable = [true, true];

    @ViewChildren(GameComponent) boards: QueryList<GameComponent>;


    constructor(
        private socketIoService: SocketioService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.socketIoService.connect(this.gameId);

        this.receiveGameJoin();
        this.receiveGameStart();
        this.receiveGameUpdate();
        this.receiveNewBoard();
    }

    ngAfterViewInit() {
        this.boards.changes.subscribe((data: any) => {
            Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.playersCells[0][this.numberOfMines[0] - this.startingNumberofMines]));
            Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.playersCells[1][this.numberOfMines[1] - this.startingNumberofMines]));
        })
    }

    gameStart() {
        this.socketIoService.gameStart(this.gameId, { numberOfBoards: this.numberOfBoards, startingNumberOfMines: this.startingNumberofMines });
    }

    reset() {
        this.rowSize = [10, 10];
        this.numberOfMines = [this.startingNumberofMines, this.startingNumberofMines];
        this.gameFinished = false;
        this.hasWon[0] = this.hasWon[1] = false;
        this.isPlayable[0] = this.isPlayable[1] = true;
    }

    gameUpdate(event, boardId) {
        if (this.playerId != boardId) return;
        event.boardId = boardId;
        this.socketIoService.gameUpdate(this.gameId, event);
    }

    async won(event, boardId) {
        this.hasWon[boardId] = true;

        if (this.playersCells[boardId][this.numberOfMines[boardId] + 1 - this.startingNumberofMines] == undefined) {
            this.isPlayable[0] = this.isPlayable[1] = false;
            this.gameFinished = true;
            return;
        }

        this.isPlayable[boardId] = false;
        await this.sleep(2000);

        Object.assign(this.boards.toArray()[boardId].board, this.boards.toArray()[boardId].newBoard(this.numberOfMines[boardId] + 1, this.playersCells[boardId][this.numberOfMines[boardId] + 1 - this.startingNumberofMines]));
        this.numberOfMines[boardId]++;

        this.hasWon[boardId] = false;
        this.isPlayable[boardId] = true;
    }

    async lost(event, boardId) {
        this.isPlayable[boardId] = false;
        await this.sleep(1000);
        if (boardId == this.playerId) this.socketIoService.newBoard(this.gameId, { boardId: boardId, mines: this.numberOfMines[boardId] });
    }

    receiveGameJoin() {
        this.socketIoService.receiveGameJoin().subscribe((message: string) => {
            this.snackbar.open(message, '', {
                duration: 3000,
            });
            this.playerId = 0;
            this.playerJoined = true;
        });
    }

    receiveGameStart() {
        this.socketIoService.receiveGameStart().subscribe((data: any) => {
            console.log('receiveGameStart', data);
            this.gameStarted = true;
            this.reset();
            this.playersCells = data.cells;

            if (this.boards.toArray().length != 0) {
                Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.playersCells[0][this.numberOfMines[0] - this.startingNumberofMines]));
                Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.playersCells[1][this.numberOfMines[1] - this.startingNumberofMines]));
            }
        });
    }

    receiveGameUpdate() {
        this.socketIoService.receiveGameUpdate().subscribe((data: any) => {
            console.log('receiveGameUpdate', data);
            if (data.type === 'checkCell') this.boards.toArray()[data.boardId].checkCell(data.cell);
            else if (data.type === 'flag') this.boards.toArray()[data.boardId].flag(data.cell);
        });
    }

    receiveNewBoard() {
        this.socketIoService.receiveNewBoard().subscribe((data: any) => {
            console.log('receiveNewBoard', data);
            Object.assign(this.boards.toArray()[data.boardId].board, this.boards.toArray()[data.boardId].newBoard(null, data.cells));
            this.isPlayable[data.boardId] = true;
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
