const PEERS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

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
        } while (cell
            || (!!firstClick
                && ((randomY == firstClick.row && randomX == firstClick.column)
                    || (randomY == firstClick.row + PEERS[0][0] && randomX == firstClick.column + PEERS[0][1])
                    || (randomY == firstClick.row + PEERS[1][0] && randomX == firstClick.column + PEERS[1][1])
                    || (randomY == firstClick.row + PEERS[2][0] && randomX == firstClick.column + PEERS[2][1])
                    || (randomY == firstClick.row + PEERS[3][0] && randomX == firstClick.column + PEERS[3][1])
                    || (randomY == firstClick.row + PEERS[4][0] && randomX == firstClick.column + PEERS[4][1])
                    || (randomY == firstClick.row + PEERS[5][0] && randomX == firstClick.column + PEERS[5][1])
                    || (randomY == firstClick.row + PEERS[6][0] && randomX == firstClick.column + PEERS[6][1])
                    || (randomY == firstClick.row + PEERS[7][0] && randomX == firstClick.column + PEERS[7][1])
                )
            )
        );
        cells[randomY][randomX] = true;
    }

    return cells;
}

module.exports = {
    createAllBoards,
    createBoard
}