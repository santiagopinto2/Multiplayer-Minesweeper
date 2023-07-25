import { Cell } from './cell';

const PEERS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export class Board {
    cells: Cell[][] = [];
    dataSource: any[] = [];

    private remainingCells = 0;
    private mineCount = 0;

    constructor(size: number, mines: number, fullCells?: [][]) {
        if (fullCells) {
            this.remainingCells = size * size;
            for (let y = 0; y < fullCells.length; y++) {
                this.cells[y] = [];
                for (let x = 0; x < fullCells[y].length; x++) {
                    this.cells[y][x] = new Cell(y, x, fullCells[y][x]);
                    
                    let adjacentMines = 0;
                    for (const peer of PEERS) {
                        if (
                            fullCells[y + peer[0]] != undefined &&
                            fullCells[y + peer[0]][x + peer[1]] != undefined &&
                            fullCells[y + peer[0]][x + peer[1]]
                        ) {
                            adjacentMines++;
                        }
                    }
                    this.cells[y][x].surroundingMines = adjacentMines;
                    if (this.cells[y][x].mine) this.mineCount++;
                }
            }
            this.remainingCells -= this.mineCount;
            return;
        }

        for (let y = 0; y < size; y++) {
            this.cells[y] = [];
            for (let x = 0; x < size; x++) this.cells[y][x] = new Cell(y, x);
        }

        // Assign mines
        for (let i = 0; i < mines; i++) {
            let cell;
            do {
                cell = this.getRandomCell();
            } while (cell.mine);
            cell.mine = true;
        }

        // Count mines
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let adjacentMines = 0;
                for (const peer of PEERS) {
                    if (
                        this.cells[y + peer[0]] &&
                        this.cells[y + peer[0]][x + peer[1]] &&
                        this.cells[y + peer[0]][x + peer[1]].mine
                    ) {
                        adjacentMines++;
                    }
                }
                this.cells[y][x].surroundingMines = adjacentMines;
                if (this.cells[y][x].mine) this.mineCount++;
            }
        }
        this.remainingCells = size * size - this.mineCount;
    }

    getRandomCell(): Cell {
        const y = Math.floor(Math.random() * this.cells.length);
        const x = Math.floor(Math.random() * this.cells[y].length);
        return this.cells[y][x];
    }

    checkCell(cell: Cell): 'gameover' | 'win' | null {
        if (cell.status !== 'hidden') return null;
        else if (cell.mine) {
            this.revealAll();
            return 'gameover';
        }
        else {
            cell.status = 'clear';

            // Empty cell, let's clear the whole block.
            if (cell.surroundingMines == 0) {
                for (const peer of PEERS) {
                    if (this.cells[cell.row + peer[0]] && this.cells[cell.row + peer[0]][cell.column + peer[1]])
                        this.checkCell(this.cells[cell.row + peer[0]][cell.column + peer[1]]);
                }
            }

            if (this.remainingCells-- <= 1) {
                this.revealAll();
                return 'win';
            }
            return null;
        }
    }

    checkSurroundings(cell) {
        let surroundingFlags = 0;
        let isGameOver = false;
        for (const peer of PEERS) {
            if (this.cells[cell.row + peer[0]] && this.cells[cell.row + peer[0]][cell.column + peer[1]] && this.cells[cell.row + peer[0]][cell.column + peer[1]].status === 'flag') {
                if (!this.cells[cell.row + peer[0]][cell.column + peer[1]].mine)
                    isGameOver = true;
                surroundingFlags++;
            }
        }

        if (cell.surroundingMines == surroundingFlags) {
            if (isGameOver) {
                this.revealAll();
                return 'gameover';
            }
            for (const peer of PEERS) {
                if (this.cells[cell.row + peer[0]] && this.cells[cell.row + peer[0]][cell.column + peer[1]]) {
                    this.checkCell(this.cells[cell.row + peer[0]][cell.column + peer[1]]);
                }
            }
        }

        if (this.remainingCells <= 1) {
            this.revealAll();
            return 'win';
        }
        return null;
    }

    revealAll() {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.status === 'hidden') cell.status = 'clear';
            }
        }
    }
}