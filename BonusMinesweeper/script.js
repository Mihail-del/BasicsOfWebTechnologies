let wdrData = [];
let gameState = [];
let minesPlaced = 0;
let isFirstClick = true;
let timerInterval = null;
let timeElapsed = 0;
let flagsPlaced = 0;

function placeMines(startR, startC) {
    while (minesPlaced < 10) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);

        if (Math.abs(r - startR) <= 1 && Math.abs(c - startC) <= 1) {
            continue;
        }

        if (!gameState[r][c].isMine) {
            gameState[r][c].isMine = true;
            minesPlaced += 1;
        }
    }
}

function countNeighborMines() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (gameState[r][c].isMine) {
                continue;
            }

            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
                        if (gameState[nr][nc].isMine) {
                            count += 1;
                        }
                    }
                }
            }

            gameState[r][c].neighborMines = count;
        }
    }
}

function revealCell(r, c) {
    if (r < 0 || r >= 9 || c < 0 || c >= 9 || gameState[r][c].isRevealed) {
        return;
    }

    gameState[r][c].isRevealed = true;

    if (gameState[r][c].neighborMines === 0 && !gameState[r][c].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revealCell(r + dr, c + dc);
            }
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed += 1;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        document.getElementById("timer").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function restartGame() {
    stopTimer();
    timeElapsed = 0;
    document.getElementById("timer").textContent = "00:00";

    flagsPlaced = 0;
    minesPlaced = 0;
    isFirstClick = true;
    document.getElementById("mines-counter").textContent = "10";
    document.getElementById("smiley-btn").textContent = "😊";

    gameState = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            row.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                isQuestioned: false,
                neighborMines: 0,
            });
        }
        gameState.push(row);
    }

    pivot.refresh();
}

function renderGameCells(cellBuilder, cellData) {
    if (cellData.type === "value" && cellData.rows && cellData.columns && cellData.rows.length > 0 && cellData.columns.length > 0) {
        const row = parseInt(cellData.rows[0].caption.substring(1), 10);
        const col = parseInt(cellData.columns[0].caption.substring(1), 10);
        const cell = gameState[row][col];

        cellBuilder.style = {
            ...(cellBuilder.style || {}),
            left: `${col * 30}px`,
            top: `${row * 30}px`,
            width: "30px",
            height: "30px",
            "min-width": "30px",
            "min-height": "30px",
            position: "absolute",
        };

        if (cell.isRevealed) {
            let content = "";
            let classes = "cell revealed";
            let inlineStyle = "";

            if (cell.isMine) {
                content = "💣";
            } else if (cell.neighborMines > 0) {
                content = cell.neighborMines;
                classes += ` n${cell.neighborMines}`;
                const numberColors = {
                    1: "#6ab0f5",
                    2: "#7ec87e",
                    3: "#f5826a",
                    4: "#9b7fe8",
                    5: "#e87e7e",
                    6: "#7ecfc8",
                    7: "#d4b8a0",
                    8: "#9a8878",
                };
                inlineStyle = ` style="color:${numberColors[cell.neighborMines]};"`;
            }

            cellBuilder.text = `<div class="${classes}"${inlineStyle}>${content}</div>`;
        } else if (cell.isFlagged) {
            cellBuilder.text = `<div class="cell hidden flagged" data-r="${row}" data-c="${col}">🚩</div>`;
        } else if (cell.isQuestioned) {
            cellBuilder.text = `<div class="cell hidden questioned" data-r="${row}" data-c="${col}">❓</div>`;
        } else {
            cellBuilder.text = `<div class="cell hidden" data-r="${row}" data-c="${col}"></div>`;
        }
    }
}

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        wdrData.push({ Row: `R${i}`, Column: `C${j}`, Value: 1 });
    }
}

for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
        row.push({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            isQuestioned: false,
            neighborMines: 0,
        });
    }
    gameState.push(row);
}

const pivot = new WebDataRocks({
    container: "#wdr-component",
    customizeCell: renderGameCells,
    toolbar: false,
    report: {
        dataSource: { data: wdrData },
        slice: {
            rows: [{ uniqueName: "Row" }],
            columns: [{ uniqueName: "Column" }],
            measures: [{ uniqueName: "Value" }],
        },
        options: {
            drillThrough: false,
            grid: {
                showHeaders: false,
                showGrandTotals: "off",
                showTotals: "off",
                showSelection: false,
            },
        },
    },
});

document.getElementById("wdr-component").addEventListener("click", (event) => {
    if (event.target.classList.contains("cell") && event.target.classList.contains("hidden")) {
        const r = parseInt(event.target.getAttribute("data-r"), 10);
        const c = parseInt(event.target.getAttribute("data-c"), 10);
        const cell = gameState[r][c];

        if (cell.isFlagged || cell.isQuestioned) {
            return;
        }

        if (isFirstClick) {
            isFirstClick = false;
            startTimer();
            placeMines(r, c);
            countNeighborMines();
        }

        revealCell(r, c);

        if (gameState[r][c].isMine) {
            document.getElementById("smiley-btn").textContent = "😵";
            alert("Game Over!");
            stopTimer();
        }

        pivot.refresh();
    }
});

document.getElementById("wdr-component").addEventListener("contextmenu", (event) => {
    event.preventDefault();

    if (event.target.classList.contains("cell") && event.target.classList.contains("hidden")) {
        const r = parseInt(event.target.getAttribute("data-r"), 10);
        const c = parseInt(event.target.getAttribute("data-c"), 10);
        const cell = gameState[r][c];

        if (!cell.isFlagged && !cell.isQuestioned) {
            cell.isFlagged = true;
            flagsPlaced += 1;
            document.getElementById("mines-counter").textContent = String(10 - flagsPlaced);
        } else if (cell.isFlagged && !cell.isQuestioned) {
            cell.isFlagged = false;
            cell.isQuestioned = true;
            flagsPlaced -= 1;
            document.getElementById("mines-counter").textContent = String(10 - flagsPlaced);
        } else if (!cell.isFlagged && cell.isQuestioned) {
            cell.isQuestioned = false;
        }

        pivot.refresh();
    }
});

document.getElementById("smiley-btn").addEventListener("click", restartGame);
