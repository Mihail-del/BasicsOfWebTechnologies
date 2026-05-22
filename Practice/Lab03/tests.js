const { validatePassword } = require('./validator');

console.log("=== Test validatePassword ===\n");

// Correct password
console.log("Test 1: validatePassword('Abc1!def')");
console.log(validatePassword("Abc1!def"));
console.log("| Expected: valid: true, errors: []\n");

// Test 2: Short password
console.log("Test 2: validatePassword('abc')");
console.log(validatePassword("abc"));
console.log("| Expected: errors about length, uppercase letters, digits, special characters\n");

// Test 3: Weak password PASSWORD123!
console.log("Test 3: validatePassword('PASSWORD123!')");
console.log(validatePassword("PASSWORD123!"));
console.log("| Expected: errors about lowercase letters\n");

// Test 4: Password with space
console.log("Test 4: validatePassword('Abc1!def gh')");
console.log(validatePassword("Abc1!def gh"));
console.log("| Expected: error about space\n");

// Test 5: Weak password qwerty
console.log("Test 5: validatePassword('Qwerty123!')");
console.log(validatePassword("Qwerty123!"));
console.log("| Expected: error 'This is a weak password'\n");

// Test 6: Without special characters
console.log("Test 6: validatePassword('Abcdefgh1')");
console.log(validatePassword("Abcdefgh1"));
console.log("| Expected: error about special characters\n");

// Test 7: QWERTY (case-insensitive)
console.log("Test 7: validatePassword('QWERTY123!')");
console.log(validatePassword("QWERTY123!"));
console.log("| Expected: errors about lowercase letters and weak password\n");