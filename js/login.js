// js/login.js

import { authenticateUser } from './api.js';

export async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');  // you need to have a div with this id in your html to show the error message.

  try {
    const token = await authenticateUser(username, password);
    sessionStorage.setItem('jwt', token);
    window.location.href = './profile.html'; 
  } catch (error) {
    errorMsg.innerText = 'Login failed: ' + error.message;
    errorMsg.style.display = 'block';
  }
}

export function handleLogout() {
    // Remove JWT from local storage
    localStorage.removeItem('jwt');

    // Redirect to the login page
    window.location.href = '/index.html';
}

