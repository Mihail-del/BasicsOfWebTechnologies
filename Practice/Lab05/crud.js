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

// TODO
