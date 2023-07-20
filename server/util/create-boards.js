function createAllBoards() {
    return { playerOneCells: createPlayersBoard(), playerTwoCells: createPlayersBoard() };
}

function createPlayersBoard() {
    let cells = [];
    const mines = 2;

    for (let i = 0; i < 10; i++) {
        cells[i] = createBoard(mines + i);
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