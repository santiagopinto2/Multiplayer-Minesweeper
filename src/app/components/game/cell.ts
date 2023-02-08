export class Cell {
    status: 'hidden' | 'clear' | 'flag' = 'hidden';
    mine = false;
    surroundingMines = 0;

    constructor(public row: number, public column: number) { }
}