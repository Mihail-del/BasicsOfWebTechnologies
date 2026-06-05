// ============================================================
// Завдання 6 — Менеджер нотаток (CRUD)
// ============================================================
// API: https://jsonplaceholder.typicode.com/todos
//   GET    /todos?_limit=10           — список
//   POST   /todos                     — створити
//   PATCH  /todos/:id                 — оновити
//   DELETE /todos/:id                 — видалити
//
// Вимоги:
//   1. Окремі функції: getTodos, createTodo, updateTodo, deleteTodo
//   2. На завантаженні → GET + рендер
//   3. Submit form → POST → додати у UI
//   4. Click checkbox → PATCH { completed } → оновити UI
//   5. Click .delete → DELETE → видалити з UI
//   6. Обробка помилок + стани disabled
// ============================================================

const API = "https://jsonplaceholder.typicode.com/todos";

const todosEl = document.getElementById("todos");
const statusEl = document.getElementById("status");
const form = document.getElementById("new-todo");
const submitBtn = form.querySelector("button");


function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#c33" : "#888";
}

function renderTodo(todo, prepend = false) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => handleToggle(todo.id, checkbox, li));

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = todo.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.title = "Delete the element";
    deleteBtn.addEventListener("click", () => handleDelete(todo.id, li, deleteBtn));

    li.append(checkbox, title, deleteBtn);

    if (prepend) {
        todosEl.prepend(li);
    } else {
        todosEl.append(li);
    }
}

async function getTodos() {
    const res = await fetch(`${API}?_limit=10`);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return res.json();
}

async function createTodo(title) {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false, userId: 1 }),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return res.json();
}

async function updateTodo(id, completed) {
    const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
    return res.json();
}

async function deleteTodo(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
}

async function handleToggle(id, checkbox, li) {
    checkbox.disabled = true;
    setStatus("Updating...");
    try {
        await updateTodo(id, checkbox.checked);
        li.classList.toggle("completed", checkbox.checked);
        setStatus("Updated");
    } catch (err) {
        checkbox.checked = !checkbox.checked;
        setStatus(`Error: ${err.message}`, true);
    } finally {
        checkbox.disabled = false;
    }
}

async function handleDelete(id, li, btn) {
    btn.disabled = true;
    setStatus("Deleting...");
    try {
        await deleteTodo(id);
        li.remove();
        setStatus("Deleted");
    } catch (err) {
        setStatus(`Error: ${err.message}`, true);
        btn.disabled = false;
    }
}

async function init() {
    setStatus("Loading...");
    try {
        const todos = await getTodos();
        todos.forEach((todo) => renderTodo(todo));
        setStatus(`Loaded ${todos.length} notes`);
    } catch (err) {
        setStatus(`Error: ${err.message}`, true);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleInput = form.querySelector("input[name='title']");
    const title = titleInput.value.trim();
    if (!title) return;

    submitBtn.disabled = true;
    setStatus("Adding...");
    try {
        const newTodo = await createTodo(title);
        renderTodo(newTodo, true);
        titleInput.value = "";
        setStatus("Added");
    } catch (err) {
        setStatus(`Error: ${err.message}`, true);
    } finally {
        submitBtn.disabled = false;
    }
});

init();
