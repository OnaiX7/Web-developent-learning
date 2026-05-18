let date = new Date();
date.setTime(date.getTime());
console.log(date.toUTCString())

document.cookie = 'user=Emiliano;path=/';
document.cookie = 'lastname=Guerrero;path=/';
document.cookie = 'age=22;path=/';

const cookies = document.cookie.split(';');
cookies.forEach(cookie => {
    const [cookieName, cookieValue] = cookie.split('=');
    console.log(cookieName, cookieValue);
    if (cookieName.trim() === 'user') {
        let welcome = document.createElement('h1');
        welcome.textContent = "Willkommen " + cookieValue;
        document.body.appendChild(welcome);
    }
})
console.log(cookies);