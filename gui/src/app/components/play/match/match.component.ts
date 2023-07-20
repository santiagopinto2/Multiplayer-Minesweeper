import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GameComponent } from '../../game/game.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

    gameId: string;
    socket: any;
    rowSize = [10, 10];
    defaultNumberofMines = 2;
    numberOfMines = [this.defaultNumberofMines, this.defaultNumberofMines];
    playerId = 1;
    playerOneCells = [];
    playerTwoCells = [];

    @ViewChildren(GameComponent) boards: QueryList<GameComponent>;


    constructor(
        private socketIoService: SocketioService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.socketIoService.connect(this.gameId);

        this.receiveGameJoin();
        this.receiveGameStart();
        this.receiveGameUpdate();
        this.receiveNewBoard();
    }

    gameStart() {
        this.socketIoService.gameStart(this.gameId);
    }

    gameUpdate(event, boardId) {
        if (this.playerId != boardId) return;
        event.boardId = boardId;
        this.socketIoService.gameUpdate(this.gameId, event);
    }

    reset() {
        this.rowSize = [10, 10];
        this.numberOfMines = [this.defaultNumberofMines, this.defaultNumberofMines];
        this.boards.forEach(board => board.board = board.newBoard());
    }

    hasWon(event, boardId) {
        if (boardId == 0) Object.assign(this.boards.toArray()[boardId].board, this.boards.toArray()[boardId].newBoard(this.numberOfMines[boardId] + 1, this.playerOneCells[this.numberOfMines[boardId] + 1 - this.defaultNumberofMines]));
        else if (boardId == 1) Object.assign(this.boards.toArray()[boardId].board, this.boards.toArray()[boardId].newBoard(this.numberOfMines[boardId] + 1, this.playerTwoCells[this.numberOfMines[boardId] + 1 - this.defaultNumberofMines]));
        this.numberOfMines[boardId]++;
    }

    hasLost(event, boardId) {
        this.socketIoService.newBoard(this.gameId, { boardId: boardId, mines: this.numberOfMines[boardId] });
    }

    receiveGameJoin() {
        this.socketIoService.receiveGameJoin().subscribe((message: string) => {
            this.snackbar.open(message, '', {
                duration: 3000,
            });
            this.playerId = 0;
        });
    }

    receiveGameStart() {
        this.socketIoService.receiveGameStart().subscribe((data: any) => {
            console.log('receiveGameStart', data);
            this.playerOneCells = data.playerOneCells;
            this.playerTwoCells = data.playerTwoCells;
            Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.playerOneCells[this.numberOfMines[0] - this.defaultNumberofMines]));
            Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.playerTwoCells[this.numberOfMines[1] - this.defaultNumberofMines]));
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
        });
    }
}
