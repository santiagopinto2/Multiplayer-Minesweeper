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
    fullCells = [];

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
        Object.assign(this.boards.toArray()[boardId].board, this.boards.toArray()[boardId].newBoard(this.numberOfMines[boardId] + 1, this.fullCells[this.numberOfMines[boardId] + 1 - this.defaultNumberofMines]));
        this.numberOfMines[boardId]++;
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
            this.fullCells = data;
            Object.assign(this.boards.toArray()[0].board, this.boards.toArray()[0].newBoard(this.numberOfMines[0], this.fullCells[this.numberOfMines[0] - this.defaultNumberofMines]));
            Object.assign(this.boards.toArray()[1].board, this.boards.toArray()[1].newBoard(this.numberOfMines[1], this.fullCells[this.numberOfMines[1] - this.defaultNumberofMines]));
        });
    }

    receiveGameUpdate() {
        this.socketIoService.receiveGameUpdate(this.gameId).subscribe((data: any) => {
            console.log('receiveGameUpdate', data);
            if (data.type === 'checkCell') this.boards.toArray()[data.boardId].checkCell(data.cell);
            else if (data.type === 'flag') this.boards.toArray()[data.boardId].flag(data.cell);
        });
    }
}
