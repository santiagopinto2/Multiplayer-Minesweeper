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

    receiveGameJoin() {
        this.socketIoService.receiveGameJoin().subscribe((message: string) => {
            this.snackbar.open(message, '', {
                duration: 3000,
            });
        });
    }

    receiveGameStart() {
        this.socketIoService.receiveGameStart().subscribe((data) => {
            console.log('receiveGameStart', data);
        });
    }

    receiveGameUpdate() {
        this.socketIoService.receiveGameUpdate(this.gameId).subscribe((data) => {
            console.log('receiveGameUpdate', data);
        });
    }

    reset() {
        this.rowSize = [10, 10];
        this.numberOfMines = [this.defaultNumberofMines, this.defaultNumberofMines];
        this.boards.forEach(board => board.board = board.newBoard());
    }

    hasWon(event, board) {
        Object.assign(this.boards.toArray()[board].board, this.boards.toArray()[board].newBoard(this.numberOfMines[board] + 1));
        this.numberOfMines[board]++;
    }
}
