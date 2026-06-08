// =============================================
// CONSTANTS & CONFIG
// =============================================

const DIFFICULTIES = {
    easy: { size: 9, mines: 10 },
    medium: { size: 16, mines: 40 },
};

const STATE = {
    CLOSED: "closed",
    OPEN: "open",
    MINE: "mine",
    FLAG: "flag",
};

// =============================================
// GAME STATE
// =============================================

let gameState = {
    board: [],
    size: 9,
    mineCount: 10,
    started: false,
    over: false,
};

// =============================================
// BOARD GENERATION
// =============================================

/**
 * Creates a fresh size×size board filled with closed, mine-free cells.
 * Each cell: { row, col, isMine, state, neighborCount }
 * @param {number} size - board dimension
 * @returns {Array<Array<Object>>} 2D array of cell objects
 */
function createBoard(size) {
    const board = [];
    for (let r = 0; r < size; r++) {
        board[r] = [];
        for (let c = 0; c < size; c++) {
            board[r][c] = {
                row: r,
                col: c,
                isMine: false,
                state: STATE.CLOSED,
                neighborCount: 0,
            };
        }
    }
    return board;
}

/**
 * Randomly places `count` mines on the board.
 * Skips the safe zone around the first click (safeRow, safeCol).
 * @param {Array<Array<Object>>} board
 * @param {number} count - number of mines to place
 * @param {number} safeRow - row of the first click
 * @param {number} safeCol - col of the first click
 */
function placeMines(board, count, safeRow, safeCol) {
    const size = board.length;
    let placed = 0;

    while (placed < count) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);

        // Skip cells that already have a mine
        if (board[r][c].isMine) continue;

        // Protect a 3×3 area around the first click so it's never instant death
        if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;

        board[r][c].isMine = true;
        placed++;
    }
}

/**
 * For every non-mine cell, counts how many of its 8 neighbours are mines
 * and stores the result in cell.neighborCount.
 * @param {Array<Array<Object>>} board
 */
function calcNeighbors(board) {
    const size = board.length;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c].isMine) continue;

            let count = 0;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue; // skip itself
                    const nr = r + dr;
                    const nc = c + dc;
                    // Stay inside board bounds
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                        if (board[nr][nc].isMine) count++;
                    }
                }
            }

            board[r][c].neighborCount = count;
        }
    }
}

/**
 * Creates a new game with the given size and mine count.
 * Board generation is deferred to the first click.
 * @param {number} size
 * @param {number} mineCount
 */
function initGame(size, mineCount) {
    gameState = {
        board: createBoard(size),
        size,
        mineCount,
        started: false,
        over: false,
    };

    console.log(`Game initialised: ${size}×${size}, ${mineCount} mines`);
}

window.addEventListener("DOMContentLoaded", () => {
    initGame(DIFFICULTIES.easy.size, DIFFICULTIES.easy.mines);
});