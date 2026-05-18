 const API = 'https://rickandmortyapi.com/api/character';
    const PER_PAGE = 20;

    let allCharacters = [];
    let displayed = 0;
    let totalLoaded = false;
    let currentPage = 0;
    let totalPages = 0;

    function statusClass(s) {
    if (s === 'Alive') return 'status-alive';
    if (s === 'Dead') return 'status-dead';
    return 'status-unknown';
}

    function statusLabel(s) {
    if (s === 'Alive') return 'Lebendig';
    if (s === 'Dead') return 'Tot';
    return 'Unbekannt';
}

    function renderCards(chars) {
    const gallery = document.getElementById('gallery');
    chars.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
          <img src="${c.image}" alt="${c.name}" loading="lazy">
          <div class="card-info">
            <div class="card-name" title="${c.name}">${c.name}</div>
            <div class="card-species">Spezies: ${c.species}</div>
            <span class="card-status ${statusClass(c.status)}">${statusLabel(c.status)}</span>
          </div>`;
    gallery.appendChild(card);
});
    displayed += chars.length;
}

    function updateControls() {
    const ctrl = document.getElementById('controls');
    const btn = document.getElementById('load-more-btn');
    const info = document.getElementById('page-info');
    const statusArea = document.getElementById('status-area');

    if (displayed > 0) ctrl.style.display = 'flex';

    info.textContent = `${displayed} von ${allCharacters.length} geladen`;

    if (displayed >= allCharacters.length && totalLoaded) {
    btn.style.display = 'none';
    statusArea.innerHTML = `<div class="end-msg">✓ Alle ${allCharacters.length} Charaktere geladen</div>`;
} else {
    btn.style.display = '';
    btn.disabled = false;
    btn.textContent = 'Lade mehr';
}
}

    function setLoading(on) {
    const btn = document.getElementById('load-more-btn');
    if (on) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Lade...';
}
}

    async function fetchPage(page) {
    const res = await fetch(`${API}?page=${page}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

    async function loadAllInBackground() {
    while (currentPage < totalPages) {
    currentPage++;
    const data = await fetchPage(currentPage);
    allCharacters = allCharacters.concat(data.results);
}
    totalLoaded = true;
    updateControls();
}

    async function init() {
    const statusArea = document.getElementById('status-area');
    statusArea.innerHTML = `<div class="loading-overlay"><span class="spinner"></span>Charaktere werden geladen...</div>`;

    try {
    const data = await fetchPage(1);
    totalPages = data.info.pages;
    currentPage = 1;
    allCharacters = data.results;

    statusArea.innerHTML = '';

    renderCards(allCharacters.slice(0, PER_PAGE));
    updateControls();

    loadAllInBackground();
} catch (e) {
    statusArea.innerHTML = `<div class="error-msg">Fehler beim Laden: ${e.message}</div>`;
}
}

    function loadMore() {
    setLoading(true);
    const next = allCharacters.slice(displayed, displayed + PER_PAGE);
    if (next.length > 0) {
    renderCards(next);
    updateControls();
} else {
    updateControls();
}
}

    init();