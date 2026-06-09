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

let pivot = null;

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

    renderBoard();
}

// =============================================
// WEBDATAROCKS INTEGRATION
// =============================================

/**
 * Converts the 2D board into a flat JSON array for WebDataRocks.
 * Row/col are zero-padded strings so WDR sorts them correctly
 * @param {Array<Array<Object>>} board
 * @returns {Array<Object>} flat array of cell records
 */
function boardToJSON(board) {
    const data = [];
    const pad = (n) => String(n).padStart(2, "0");

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const cell = board[r][c];

            let display;
            if (cell.state === STATE.FLAG) display = "flag";
            else if (cell.state === STATE.CLOSED) display = "closed";
            else if (cell.state === STATE.MINE) display = "mine";
            else display = String(cell.neighborCount);

            data.push({
                row: `R${pad(r)}`,
                col: `C${pad(c)}`,
                display,
                rowIdx: r,
                colIdx: c,
            });
        }
    }

    return data;
}

/**
 * Builds the WDR report config.
 * Grand totals and sorting are off - we just need a clean grid.
 * @param {Array<Object>} jsonData - output of boardToJSON()
 * @returns {Object} WDR report object
 */
function buildReport(jsonData) {
    return {
        dataSource: { data: jsonData },
        slice: {
            rows: [{ uniqueName: "row" }],
            columns: [{ uniqueName: "col" }],
            measures: [{ uniqueName: "display", aggregation: "first" }],
        },
        options: {
            grid: {
                showGrandTotals: "off",
                showTotals: "off",
                sorting: "off",
                showFilter: false,
            },
            configuratorButton: false,
        },
    };
}

/**
 * First call: creates the WDR pivot instance.
 * Subsequent calls: updates data in-place via updateData()
 * (faster than setReport - no full re-render).
 */
function renderBoard() {
    const jsonData = boardToJSON(gameState.board);

    if (!pivot) {
        pivot = new WebDataRocks({
            container: "#wdr-component",
            toolbar: false,
            height: 600,
            report: buildReport(jsonData),
            customizeCell: customizeCell,
        });
    } else {
        pivot.updateData({ data: jsonData });
    }
}

// =============================================
// CELL RENDERING
// =============================================

const CELL_ICONS = {
    closed: "",
    flag: "flag",
    mine: "bomb",
};
const NUM_CLASS = ["", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"];

/**
 * WDR hook — called for every rendered cell.
 * We only touch data cells (type === "value"); headers are left as-is.
 *
 * cellBuilder.text  — overrides the cell's text content
 * cellBuilder.html  — overrides with raw HTML
 * cellBuilder.addClass() — appends a CSS class to the cell
 *
 * @param {Object} cellBuilder - WDR cell builder object
 * @param {Object} cellData    - WDR cell metadata
 */
function customizeCell(cellBuilder, cellData) {
    if (cellData.type !== "value") return;

    const display = cellData.label;
    const num = parseInt(display, 10);
    const isNum = !isNaN(num);

    let classes = "ms-cell";
    let content = "";

    if (display === "closed") {
        classes += " closed";

    } else if (display === "flag") {
        classes += " flag";
        content = `<span class="material-icons">flag</span>`;

    } else if (display === "mine") {
        classes += " mine";
        content = `<span class="material-icons">bomb</span>`;

    } else if (isNum && num === 0) {
        classes += " open";

    } else if (isNum) {
        classes += ` open n${num}`;
        content = display;
    }

    cellBuilder.html = `<div class="${classes}">${content}</div>`;
}

window.addEventListener("DOMContentLoaded", () => {
    initGame(DIFFICULTIES.easy.size, DIFFICULTIES.easy.mines);
});