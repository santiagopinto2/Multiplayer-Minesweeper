function createBoards() {
    return new Promise(function (resolve, reject) {
        let cells = [];
        const size = 10, mines = 2;

        for (let i = 0; i < 10; i++) {
            cells[i] = [];
            for (let y = 0; y < size; y++) {
                cells[i][y] = [];
                for (let x = 0; x < size; x++) cells[i][y][x] = false;
            }

            // Assign mines
            for (let j = 0; j < mines + i; j++) {
                let cell, randomY, randomX;
                do {
                    randomY = Math.floor(Math.random() * size);
                    randomX = Math.floor(Math.random() * size);
                    cell = cells[i][randomY][randomX];
                } while (cell);
                cells[i][randomY][randomX] = true;
            }
        }

        resolve(cells)
    });
}

module.exports = {
    createBoards
}