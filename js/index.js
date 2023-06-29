// js/index.js

import { handleLogin,  handleLogout } from './login.js';
import { displayUserData } from './profile.js';
// Call the function to handle the login process when the login form is submitted.
const login = document.getElementById('login-form');
if (login != null) {
    login.addEventListener('submit', handleLogin);
}

const logout= document.getElementById('logout-button');
if (logout != null) {
    logout.addEventListener('click', handleLogout);
}

// Call the function to display the profile data when the profile page is loaded.
window.addEventListener('load', displayUserData);
