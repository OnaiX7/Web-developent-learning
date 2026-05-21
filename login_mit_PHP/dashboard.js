const INACTIVITY_TIMEOUT = 60 * 1000;
const HEARTBEAT_THROTTLE = 10 * 1000;

let inactivityTimer = null;
let lastHeartbeat = 0;

async function validateLogin() {
    try {
        const response = await fetch('api/validation.php');
        const data = await response.json();
        if (data.success === true) {
            const span = document.getElementById('welcome');
            span.textContent = data.fullname;
        } else {
            location.href = "index.html";
        }
    } catch (err) {
        location.href = "index.html";
    }
}

async function logoutUser() {
    try {
        await fetch('api/logout.php');
    } catch (err) {}
    window.location.href = "index.html";
}

function resetInactivityTimer() {
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(logoutUser, INACTIVITY_TIMEOUT);

    const now = Date.now();
    if (now - lastHeartbeat > HEARTBEAT_THROTTLE) {
        lastHeartbeat = now;
        fetch('api/heartbeat.php').catch(() => {});
    }
}

document.addEventListener('mousemove', validateLogin);
document.addEventListener('keydown', validateLogin);
document.addEventListener('click', validateLogin);

document.getElementById('logout').addEventListener('click', (e) => {
    e.stopPropagation();
    logoutUser();
});

validateLogin();
resetInactivityTimer();