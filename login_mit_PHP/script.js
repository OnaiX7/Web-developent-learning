const showLogin = document.getElementById("send-to-login");
const showRegister = document.getElementById("send-to-register");
const registerContainer = document.getElementById('register-container');
const loginContainer = document.getElementById('login-container');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login');

function showForm(form) {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    form.style.display = 'flex';
}

showRegister.addEventListener('click', () => showForm(registerContainer));
showLogin.addEventListener('click', () => showForm(loginContainer));

registerBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    if (password !== password2) {
        alert('Die Passwörter stimmen nicht überein.');
        return;
    }

    const dataToSend = {
        fullname: document.getElementById('reg-fullname').value,
        username: document.getElementById('reg-username').value,
        password: password,
        password2: password2,
    };

    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        const data = await response.json();
        if (data.success === true) {
            showForm(loginContainer);
        } else {
            alert('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        }
    } catch (err) {
        alert('Fehler bei der Verbindung zum Server.');
    }
});

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const dataToSend = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        const data = await response.json();
        if (data.success === true) {
            location.href = 'dashboard.html';
        } else {
            alert('Benutzername oder Passwort falsch.');
        }
    } catch (err) {
        alert('Fehler bei der Verbindung zum Server.');
    }
});