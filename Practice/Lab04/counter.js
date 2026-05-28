// ============================================================
// Завдання 2 — Лічильник напоїв з історією
// ============================================================
// Вимоги:
//   1. +/- через delegation, дані з dataset, МІНІМУМ 0.
//   2. localStorage — persist стану.
//   3. #total = сума; #leader = напій з max; контейнер лідера .is-leader.
//   4. #history — останні 5 дій ("+1 кави", "-1 води", "reset").
//   5. #undo — інверсія останньої дії, до 10 кроків назад.
//   6. #reset — confirm() перед скиданням; reset теж скасовується через undo.
//   7. #export — створює і скачує JSON-файл зі станом.
//   8. Throttle: повторні кліки по тій самій кнопці — не частіше ніж 200мс.
//   9. Event delegation замість окремих listener'ів.
// ============================================================

const STORAGE_KEY = "task-2-counters";
const HISTORY_LIMIT = 5;
const UNDO_LIMIT = 10;
const THROTTLE_MS = 200;

// TODO
let state = {
    counters: {
        "кави": 0,
        "чаю": 0,
        "води": 0
    },
    historyLog: []
};

let undoStack = [];

const throttleTimers = {};

const countersContainer = document.getElementById("counters");
const totalEl = document.getElementById("total");
const leaderEl = document.getElementById("leader");
const historyList = document.getElementById("history");
const undoBtn = document.getElementById("undo");
const resetBtn = document.getElementById("reset");
const exportBtn = document.getElementById("export");

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.counters) state.counters = { "кави": 0, "чаю": 0, "води": 0 };
            if (!state.historyLog) state.historyLog = [];
        } catch (e) {
            console.error("Помилка парсингу localStorage", e);
        }
    }
}

function pushToUndoStack() {
    undoStack.push(JSON.stringify(state));
    if (undoStack.length > UNDO_LIMIT) {
        undoStack.shift();
    }
}

function updateDOM() {
    let total = 0;
    let maxVal = -1;
    let leaders = [];

    const counterElements = countersContainer.querySelectorAll(".counter");

    counterElements.forEach(counterEl => {
        const name = counterEl.getAttribute("data-name");
        const val = state.counters[name] || 0;

        const valueSpan = counterEl.querySelector(".value");
        if (valueSpan) valueSpan.textContent = val;

        total += val;
        if (val > maxVal) {
            maxVal = val;
            leaders = [name];
        } else if (val === maxVal) {
            leaders.push(name);
        }
    });

    let leaderText = "-";
    if (total > 0) {
        const formattedLeaders = leaders.map(l => l.charAt(0).toUpperCase() + l.slice(1));
        leaderText = formattedLeaders.join(", ");
    }
    leaderEl.textContent = leaderText;

    counterElements.forEach(counterEl => {
        const name = counterEl.getAttribute("data-name");
        const val = state.counters[name] || 0;
        if (total > 0 && val === maxVal) {
            counterEl.classList.add("is-leader");
        } else {
            counterEl.classList.remove("is-leader");
        }
    });

    totalEl.textContent = total;

    historyList.innerHTML = "";
    state.historyLog.slice(-HISTORY_LIMIT).reverse().forEach(log => {
        const li = document.createElement("li");
        li.textContent = log;
        historyList.appendChild(li);
    });

    undoBtn.disabled = undoStack.length === 0;
}

function addHistoryLog(message) {
    state.historyLog.push(message);
    if (state.historyLog.length > HISTORY_LIMIT) {
        state.historyLog.shift();
    }
}

countersContainer.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const counterEl = button.closest(".counter");
    if (!counterEl) return;

    const name = counterEl.getAttribute("data-name");
    const isPlus = button.classList.contains("plus");

    const now = Date.now();
    if (throttleTimers[name] && (now - throttleTimers[name] < THROTTLE_MS)) {
        return;
    }
    throttleTimers[name] = now;

    if (!isPlus && (state.counters[name] || 0) <= 0) {
        return;
    }

    pushToUndoStack();

    if (isPlus) {
        state.counters[name] = (state.counters[name] || 0) + 1;
        addHistoryLog(`+1 ${name}`);
    } else {
        state.counters[name] = (state.counters[name] || 0) - 1;
        addHistoryLog(`-1 ${name}`);
    }

    saveState();
    updateDOM();
});

undoBtn.addEventListener("click", () => {
    if (undoStack.length === 0) return;
    const previousStateRaw = undoStack.pop();
    state = JSON.parse(previousStateRaw);

    saveState();
    updateDOM();
});

resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all timers?")) return;

    pushToUndoStack();

    for (let key in state.counters) {
        state.counters[key] = 0;
    }

    addHistoryLog("reset");

    saveState();
    updateDOM();
});

exportBtn.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `counters-state-${Date.now()}.json`);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

loadState();
updateDOM();
