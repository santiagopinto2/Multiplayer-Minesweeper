import { Component, Input, OnInit } from '@angular/core';
import { Board } from './board';
import { Cell } from './cell';


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {


    board: Board = new Board(0, 0);
    displayedColumns = [];
    @Input() rowSize = 10;
    @Input() numberOfMines = 4;
    @Input() boardId = '';
    isPlayable = true;



    constructor() {
    }

    ngOnInit(): void {
        this.board = this.newBoard();
        for (let i = 0; i < this.rowSize; i++) this.displayedColumns.push(i.toString());
        this.setTableWidth();
    }

    ngAfterViewInit() {
        this.setTableWidth();
    }

    setTableWidth() {
        const table = document.getElementById(this.boardId);
        if (!!table) table.style.width = `${49 * this.rowSize}px`;
    }

    checkCell(board, cell: Cell) {
        if (cell.status === 'clear') this.checkSurroundings(board, cell);
        else {
            const result = board.checkCell(cell);
            if (result === 'gameover') this.gameover(board);
            else if (result === 'win') alert('you win');
        }
    }

    checkSurroundings(board, cell) {
        if (cell.status === 'clear') {
            const result = board.checkSurroundings(cell);
            if (result === 'gameover') this.gameover(board);
            else if (result === 'win') alert('you win');
        }
    }

    flag(cell: Cell) {
        if (cell.status === 'flag') cell.status = 'hidden';
        else if (cell.status === 'hidden') cell.status = 'flag';
    }

    newBoard() {
        let board = new Board(this.rowSize, this.numberOfMines);
        for (let i = 0; i < this.rowSize; i++) board.dataSource.push(board.cells[i]);
        return board;
    }

    async gameover(board) {
        this.isPlayable = false;
        await this.sleep(1000);
        Object.assign(board, this.newBoard());
        this.isPlayable = true;
    }

    cellBackground(cell) {
        if (!this.isPlayable) return 'red-cell';
        if (cell.status === 'hidden' || cell.status === 'flag') return 'light-cell';
        return 'dark-cell';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}