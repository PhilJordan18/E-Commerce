import { handleLogin } from './auth.js';

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password-user');
const errorMessage = document.getElementById('error-message');

handleLogin(usernameInput, passwordInput, errorMessage);