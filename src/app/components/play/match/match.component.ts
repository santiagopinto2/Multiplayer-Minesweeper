import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Board } from '../../game/board';
import { GameComponent } from '../../game/game.component';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {


    rowSize = 10;
    numberOfMines = 5;

    @ViewChildren(GameComponent) boards: QueryList<GameComponent>;

    constructor() { }

    ngOnInit(): void {
    }

    newBoard() {
        let board = new Board(this.rowSize, this.numberOfMines);
        for (let i = 0; i < this.rowSize; i++) board.dataSource.push(board.cells[i]);
        return board;
    }

    reset() {
        this.boards.forEach(board => board.board = this.newBoard());
    }
}
