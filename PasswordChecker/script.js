const pwd = document.getElementById('password');
const strengthTxt = document.getElementById('strengthText');
const strengthProg = document.getElementById('progressBar');

pwd.addEventListener('keyup', checkPassword);

async function checkPassword() {
    const res = await fetch('chkPassword.php', {
        method: 'post',
        body: pwd.value,
        headers: {'Content-Type': 'text/plain; charset=UTF-8'}
    });
    const data = await res.text();

    strengthTxt.textContent = data;

    if (pwd.value === '') {
        strengthTxt.textContent = '';
        strengthProg.style.width = '0%';
    }else if (data === 'schwach') {
        strengthTxt.className = 'strength-text weak';
        strengthProg.style.width = '33%';
        strengthProg.style.background = '#f97373';
    } else if (data === 'ok') {
        strengthTxt.className = 'strength-text medium';
        strengthProg.style.width = '66%';
        strengthProg.style.background = '#facc15';
    } else if (data === 'super') {
        strengthTxt.className = 'strength-text strong';
        strengthProg.style.width = '100%';
        strengthProg.style.background = '#4ade80';
    }
}