// ============================================================
// Завдання 4 — Валідатор паролів
// ============================================================

/**
 * Перевіряє пароль за 7 правилами:
 *
 * 1. Довжина >= 8 символів
 * 2. Хоча б одна велика літера (A-Z)
 * 3. Хоча б одна мала літера (a-z)
 * 4. Хоча б одна цифра (0-9)
 * 5. Хоча б один спецсимвол !@#$%^&*
 * 6. Без пробілів
 * 7. Не зі списку WEAK_PASSWORDS (case-insensitive)
 *
 * Повертає об'єкт:
 *   { valid: boolean, errors: string[] }
 *
 * Якщо порушено кілька правил — у errors мають бути ВСІ повідомлення.
 */

const WEAK_PASSWORDS = ["password", "12345678", "qwerty", "admin"];

function hasUpperCase(password) {
  return /[A-Z]/.test(password);
}

function hasLowerCase(password) {
  return /[a-z]/.test(password);
}

function hasDigit(password) {
  return /[0-9]/.test(password);
}

function hasSpecialChar(password) {
  return /[!@#$%^&*]/.test(password);
}

function hasSpaces(password) {
  return /\s/.test(password);
}

function isWeakPassword(password) {
  return WEAK_PASSWORDS.includes(password.toLowerCase());
}

function validatePassword(password) {

}
