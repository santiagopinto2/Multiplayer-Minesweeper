function createAllBoards(numberOfBoards, startingNumberOfMines) {
    let cells = [];

    for (let i = 0; i < 2; i++) {
        cells[i] = [];
        for (let j = 0; j < numberOfBoards; j++) {
            cells[i][j] = createBoard(startingNumberOfMines + j);
        }
    }

    return cells;
}

function createBoard(mines, firstClick = null) {
    let cells = [];
    const size = 10;

    for (let y = 0; y < size; y++) {
        cells[y] = [];
        for (let x = 0; x < size; x++) cells[y][x] = false;
    }

    // Assign mines
    for (let i = 0; i < mines; i++) {
        let cell, randomY, randomX;
        do {
            randomY = Math.floor(Math.random() * size);
            randomX = Math.floor(Math.random() * size);
            cell = cells[randomY][randomX];
        } while (cell || (!!firstClick && randomY == firstClick.row && randomX == firstClick.column));
        cells[randomY][randomX] = true;
    }

    return cells;
}

module.exports = {
    createAllBoards,
    createBoard
}