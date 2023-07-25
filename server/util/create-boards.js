function createAllBoards(numberOfBoards, startingNumberOfMines) {
    return { cells: createPlayersBoard(numberOfBoards, startingNumberOfMines) }
}

function createPlayersBoard(numberOfBoards, startingNumberOfMines) {
    let cells = [];
    const mines = startingNumberOfMines;

    for (let i = 0; i < 2; i++) {
        cells[i] = [];
        for (let j = 0; j < numberOfBoards; j++) {
            cells[i][j] = createBoard(mines + j);
        }
    }

    return cells;
}

function createBoard(mines) {
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
        } while (cell);
        cells[randomY][randomX] = true;
    }

    return cells;
}

module.exports = {
    createAllBoards,
    createBoard
}