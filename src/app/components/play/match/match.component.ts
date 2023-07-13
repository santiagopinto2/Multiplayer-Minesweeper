import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Board } from '../../game/board';
import { GameComponent } from '../../game/game.component';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {


    rowSize = [10, 10];
    defaultNumberofMines = 2;
    numberOfMines = [this.defaultNumberofMines, this.defaultNumberofMines];

    @ViewChildren(GameComponent) boards: QueryList<GameComponent>;

    
    constructor() { }

    ngOnInit(): void {
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
