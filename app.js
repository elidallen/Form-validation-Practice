// Get references to the form elements and error display div
const registrationForm = document.getElementById('registration');
const loginForm = document.getElementById('login');
const errorDisplay = document.getElementById('errorDisplay');

// Define an object to store registered users
const registeredUsers = [];

// Event listener for the registration form
registrationForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get form inputs
  const usernameInput = registrationForm.querySelector('input[name="username"]');
  const emailInput = registrationForm.querySelector('input[name="email"]');
  const passwordInput = registrationForm.querySelector('input[name="password"]');
  const passwordCheckInput = registrationForm.querySelector('input[name="passwordCheck"]');
  const termsCheckbox = registrationForm.querySelector('input[name="terms"]');

  // Reset error display
  errorDisplay.style.display = 'none';

  // Validation checks
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const passwordCheck = passwordCheckInput.value;

  if (!username) {
    showError('Username cannot be blank', usernameInput);
    return;
  }

  if (username.length < 4) {
    showError('Username must be at least four characters long', usernameInput);
    return;
  }

  if (!isUsernameUnique(username)) {
    showError('That username is already taken', usernameInput);
    return;
  }

  if (!isValidUsername(username)) {
    showError('Username cannot contain special characters or whitespace', usernameInput);
    return;
  }

  if (!email) {
    showError('Email cannot be blank', emailInput);
    return;
  }

  if (!isValidEmail(email)) {
    showError('Email must be a valid email address and not from example.com', emailInput);
    return;
  }

  if (password.length < 12) {
    showError('Password must be at least 12 characters long', passwordInput);
    return;
  }

  if (!hasUpperCaseLetter(password) || !hasLowerCaseLetter(password)) {
    showError('Password must have at least one uppercase and one lowercase letter', passwordInput);
    return;
  }

  if (!hasNumber(password)) {
    showError('Password must contain at least one number', passwordInput);
    return;
  }

  if (!hasSpecialCharacter(password)) {
    showError('Password must contain at least one special character', passwordInput);
    return;
  }

  if (password.toLowerCase().includes('password') || password.toLowerCase().includes(username.toLowerCase())) {
    showError('Password cannot contain the word "password" or the username', passwordInput);
    return;
  }

  if (password !== passwordCheck) {
    showError('Passwords do not match', passwordCheckInput);
    return;
  }

  if (!termsCheckbox.checked) {
    showError('You must accept the Terms of Use', termsCheckbox);
    return;
  }

  // If all validation is successful, store the user data
  registeredUsers.push({ username, email, password });
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  // Clear form fields and show a success message
  registrationForm.reset();
  alert('Registration successful!');
});

// Event listener for the login form
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get form inputs
  const usernameInput = loginForm.querySelector('input[name="username"]');
  const passwordInput = loginForm.querySelector('input[name="password"]');
  const persistCheckbox = loginForm.querySelector('input[name="persist"]');

  // Reset error display
  errorDisplay.style.display = 'none';

  // Validation checks
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!username) {
    showError('Username cannot be blank', usernameInput);
    return;
  }

  if (!localStorage.getItem('registeredUsers')) {
    showError('No registered users found. Please register first.', usernameInput);
    return;
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers'));
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    showError('Invalid username or password', passwordInput);
    return;
  }

  // Clear form fields and show a success message
  loginForm.reset();
  const successMessage = persistCheckbox.checked ? 'Login successful (Persistent Login).' : 'Login successful.';
  alert(successMessage);
});

// Helper functions for validation
function showError(message, inputElement) {
  errorDisplay.innerHTML = message;
  errorDisplay.style.display = 'block';
  inputElement.focus();
}

function isUsernameUnique(username) {
  const existingUsers = registeredUsers.map((u) => u.username.toLowerCase());
  return !existingUsers.includes(username.toLowerCase());
}

function isValidUsername(username) {
  const pattern = /^[a-zA-Z0-9]+$/;
  return pattern.test(username);
}

function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return !pattern.test(email) || email.endsWith('example.com') ? false : true;
}

function hasUpperCaseLetter(text) {
  return /[A-Z]/.test(text);
}

function hasLowerCaseLetter(text) {
  return /[a-z]/.test(text);
}

function hasNumber(text) {
  return /\d/.test(text);
}

function hasSpecialCharacter(text) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(text);
}
