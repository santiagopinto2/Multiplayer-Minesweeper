import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    gameId: string;
    socket: any;

    settingsFormControl = new FormGroup({
        numberOfBoards: new FormControl(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        startingNumberOfMines: new FormControl(10, [Validators.required, Validators.min(1), Validators.max(80)])
    });
    numberOfBoards = this.settingsFormControl.get('numberOfBoards');
    startingNumberOfMines = this.settingsFormControl.get('startingNumberOfMines');

    boardCounter = [0, 0];
    numberOfMines = [this.startingNumberOfMines.value, this.startingNumberOfMines.value];
    rowSize = [10, 10];
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
            this.assignBoards();
        });
    }

    gameStart() {
        this.socketIoService.gameStart(this.gameId, { numberOfBoards: this.numberOfBoards.value, startingNumberOfMines: this.startingNumberOfMines.value });
    }

    reset() {
        this.rowSize = [10, 10];
        this.boardCounter = [0, 0];
        this.numberOfMines[0] = this.numberOfMines[1] = this.startingNumberOfMines.value;
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

            if (this.playerId == 1) {
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

    assignBoards() {
        Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.playersCells[0][0]));
        Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.playersCells[1][0]));
    }

    settingFormatter(setting, max) {
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
