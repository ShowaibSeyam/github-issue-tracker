const loginBtn = document.getElementById('loginButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

loginBtn.addEventListener('click', function () {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === 'admin' && password === 'admin123') {
        errorMsg.classList.add('hidden');
        window.location.href = './home.html';
    } else {
        errorMsg.classList.remove('hidden');
        usernameInput.classList.add('border-red-400');
        passwordInput.classList.add('border-red-400');
    }
});

// Clear error state on input
[usernameInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
        errorMsg.classList.add('hidden');
        usernameInput.classList.remove('border-red-400');
        passwordInput.classList.remove('border-red-400');
    });
});