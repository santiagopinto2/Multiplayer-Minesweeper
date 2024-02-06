import { Component, Input, OnInit, Output } from '@angular/core';
import { Board } from './board';
import { Cell } from './cell';
import { EventEmitter } from '@angular/core';


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {


    board: Board = new Board(0, 0);
    displayedColumns = [];
    timeoutHandler;
    @Input() rowSize = 10;
    @Input() numberOfMines = 4;
    @Input() boardId = '';
    @Input() playerId: number;
    @Output() wonEmitter: EventEmitter<boolean> = new EventEmitter();
    @Output() lostEmitter: EventEmitter<boolean> = new EventEmitter();
    @Output() gameUpdate: EventEmitter<any> = new EventEmitter();
    @Input() gameStarting = false;
    @Input() hasWon = false;
    @Input() isPlayable = true;
    @Input() isFirstClick = true;



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

    cellPressed(cell: Cell, event) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
            this.timeoutHandler = setTimeout(() => {
                this.sendGameUpdate(cell, 'flag');
                this.timeoutHandler = null;
            }, 500);
        }
    }

    cellReleased(cell: Cell, event) {
        if (!this.timeoutHandler) {
            if (event.button == 0 || (event.button == 1 && cell.status === 'clear')) this.sendGameUpdate(cell, 'checkCell');
            else if (event.button == 2) this.sendGameUpdate(cell, 'flag');
        }
        else {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
            this.sendGameUpdate(cell, 'checkCell');
        }
    }

    checkCell(cell: Cell, fromServer = false) {
        cell = this.board.cells[cell.row][cell.column];
        //this.gameUpdate.emit({ cell: cell, type: 'checkCell' });

        if (this.isFirstClick && !fromServer) return;

        if (cell.status === 'clear' && cell.surroundingMines != 0) this.checkSurroundings(this.board, cell);
        else {
            const result = this.board.checkCell(cell);
            if (result === 'gameover') this.lost(this.board);
            else if (result === 'win') this.won(this.board);
        }
    }

    checkSurroundings(board, cell) {
        if (cell.status === 'clear') {
            const result = board.checkSurroundings(cell);
            if (result === 'gameover') this.lost(board);
            else if (result === 'win') this.won(board);
        }
    }

    flag(cell: Cell, fromServer = false) {
        if (this.isFirstClick && !fromServer) return;
        cell = this.board.cells[cell.row][cell.column];
        //this.gameUpdate.emit({ cell: cell, type: 'flag' });
        if (cell.status === 'flag') cell.status = 'hidden';
        else if (cell.status === 'hidden') cell.status = 'flag';
    }

    newBoard(numberOfMines = this.numberOfMines, fullCells?) {
        let board = fullCells ? new Board(this.rowSize, numberOfMines, fullCells) : new Board(this.rowSize, numberOfMines);
        for (let i = 0; i < this.rowSize; i++) board.dataSource.push(board.cells[i]);
        return board;
    }

    won(board) {
        this.wonEmitter.emit(true);
    }

    lost(board) {
        this.lostEmitter.emit(true);
    }

    cellBackground(cell) {
        if (this.gameStarting) return 'dark-cell';
        if (!this.isPlayable && this.hasWon) return 'green-cell';
        if (!this.isPlayable && !this.hasWon) return 'red-cell';
        if (cell.status === 'hidden' || cell.status === 'flag') return 'light-cell';
        return 'dark-cell';
    }

    stringToNumber(number) {
        return Number(number);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sendGameUpdate(cell: Cell, type) {
        this.gameUpdate.emit({ cell: cell, type: type });
    }
}