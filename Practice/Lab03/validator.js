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

function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit (0-9).");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*).");
  }

  if (/\s/.test(password)) {
    errors.push("Password must not contain spaces.");
  }

  if (WEAK_PASSWORDS.some(weak => password.toLowerCase().startsWith(weak))) {
    errors.push("This is a weak password.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

//module.exports = { validatePassword };

if (typeof document !== "undefined") {
  const passwordInput = document.getElementById("passwordInput");
  const validateButton = document.getElementById("validateButton");
  const output = document.getElementById("output");
  validateButton.addEventListener("click", () => {
    const password = passwordInput.value;
    const result = validatePassword(password);
    
    // Update input border color based on validation
    if (result.valid) {
      passwordInput.classList.remove("invalid");
      passwordInput.classList.add("valid");
    } else {
      passwordInput.classList.remove("valid");
      passwordInput.classList.add("invalid");
    }
    
    output.innerHTML = `
      ${result.errors.length > 0 ? `<ul>${result.errors.map(e => `<li>${e}</li>`).join("")}</ul>` : ""}
    `;
  });
}