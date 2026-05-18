 function handleSend() {
    const vorname = document.getElementById('vorname').value.trim();
    const nachname = document.getElementById('nachname').value.trim();
    const email = document.getElementById('email').value.trim();
    const nachricht = document.getElementById('nachricht').value.trim();

    if (!vorname || !nachname || !email || !nachricht) {
    alert('Bitte füllen Sie alle Felder aus.');
    return;
}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    return;
}

    document.getElementById('success').style.display = 'block';
    document.getElementById('vorname').value = '';
    document.getElementById('nachname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('nachricht').value = '';

    setTimeout(() => {
    document.getElementById('success').style.display = 'none';
}, 4000);
}