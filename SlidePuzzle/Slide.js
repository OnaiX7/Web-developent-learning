const startScreen  = document.getElementById("start-screen");
const gameScreen   = document.getElementById("game-screen");
const winOverlay   = document.getElementById("win-overlay");

const container    = document.getElementById("puzzle-container");
const previewEl    = document.getElementById("preview");

const startBtn     = document.getElementById("start-button");
const backBtn      = document.getElementById("back-button");
const restartBtn   = document.getElementById("restart-button");

const timerEl      = document.getElementById("timer");
const movesEl      = document.getElementById("moves");
const bestEl       = document.getElementById("best-time");

const imageInput   = document.getElementById("image-url");
const debugToggle  = document.getElementById("debug-toggle");
const gridOptions  = document.querySelectorAll(".grid-option");
const bestTimesEl  = document.getElementById("best-times");

const winBadge     = document.getElementById("win-badge");
const winTime      = document.getElementById("win-time");
const winMoves     = document.getElementById("win-moves");
const winGrid      = document.getElementById("win-grid");
const winAgainBtn  = document.getElementById("win-again");
const winMenuBtn   = document.getElementById("win-menu");

const confettiCanvas = document.getElementById("confetti");

let size       = 4;
let imgURL     = "";
let debug      = false;
let board      = [];
let moves      = 0;
let startTime  = 0;
let timerRAF   = null;
let elapsed    = 0;
let imageReady = false;

const STORAGE_KEY = "shift-puzzle-best-times-v1";

function loadBestTimes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
}
function saveBestTime(sizeKey, ms) {
    const data = loadBestTimes();
    if (!data[sizeKey] || ms < data[sizeKey]) {
        data[sizeKey] = ms;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true; // new record
    }
    return false;
}
function renderBestTimes() {
    const data = loadBestTimes();
    const sizes = [2, 3, 4, 6];
    bestTimesEl.innerHTML = sizes.map(s => {
        const ms = data[s];
        const val = ms ? formatTime(ms) : "—";
        const cls = ms ? "" : "best-times__value--empty";
        return `
            <div class="best-times__item">
                <span class="best-times__size">${s}×${s}</span>
                <span class="best-times__value ${cls}">${val}</span>
            </div>`;
    }).join("");
}

function formatTime(ms) {
    const total = ms / 1000;
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const d = Math.floor((total * 10) % 10);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${d}`;
}

function startTimer() {
    stopTimer();
    startTime = performance.now();
    const tick = () => {
        elapsed = performance.now() - startTime;
        timerEl.textContent = formatTime(elapsed);
        timerRAF = requestAnimationFrame(tick);
    };
    timerRAF = requestAnimationFrame(tick);
}
function stopTimer() {
    if (timerRAF) cancelAnimationFrame(timerRAF);
    timerRAF = null;
}

function showScreen(name) {
    startScreen.hidden = name !== "start";
    gameScreen.hidden  = name !== "game";
    if (name === "start") {
        stopTimer();
        renderBestTimes();
    }
}

gridOptions.forEach(opt => {
    opt.addEventListener("click", () => {
        gridOptions.forEach(o => {
            o.classList.remove("is-selected");
            o.setAttribute("aria-checked", "false");
        });
        opt.classList.add("is-selected");
        opt.setAttribute("aria-checked", "true");
        size = parseInt(opt.dataset.size);
    });
});

function pickImage(autoSeed = false) {
    const userInput = imageInput.value.trim();
    if (autoSeed || !userInput) {
        return `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/600`;
    }
    return userInput;
}

function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(url);
        // On failure, fall back to a random Picsum so the game still starts.
        img.onerror = () => {
            const fallback = `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/600`;
            const img2 = new Image();
            img2.onload = () => resolve(fallback);
            img2.onerror = () => resolve(fallback);
            img2.src = fallback;
        };
        img.src = url;
    });
}

async function initGame(newImage = true) {
    debug = debugToggle.checked;

    if (newImage || !imgURL) {
        imgURL = pickImage();
        imageReady = false;
        imgURL = await preloadImage(imgURL);
        imageReady = true;
    }

    previewEl.style.backgroundImage = `url(${imgURL})`;

    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    board = [];
    for (let i = 0; i < size * size - 1; i++) board.push(i + 1);
    board.push(null);
    scrambleSolvable();

    moves = 0;
    elapsed = 0;
    movesEl.textContent = "0";
    timerEl.textContent = "00:00.0";

    const bests = loadBestTimes();
    bestEl.textContent = bests[size] ? formatTime(bests[size]) : "—";

    drawBoard();
    startTimer();
}

function scrambleSolvable() {
    const movesCount = size * size * 20; // plenty of mixing
    let emptyIdx = board.indexOf(null);
    let lastEmpty = -1;
    for (let i = 0; i < movesCount; i++) {
        const neighbors = neighborsOf(emptyIdx).filter(n => n !== lastEmpty);
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        [board[emptyIdx], board[pick]] = [board[pick], board[emptyIdx]];
        lastEmpty = emptyIdx;
        emptyIdx = pick;
    }
    if (checkWin()) {
        [board[0], board[1]] = [board[1], board[0]];
    }
}

function neighborsOf(idx) {
    const x = idx % size, y = Math.floor(idx / size);
    const out = [];
    if (x > 0)        out.push(idx - 1);
    if (x < size - 1) out.push(idx + 1);
    if (y > 0)        out.push(idx - size);
    if (y < size - 1) out.push(idx + size);
    return out;
}

function drawBoard() {
    container.innerHTML = "";

    const rect = container.getBoundingClientRect();
    const padding = 6;
    const gap = 4;
    const innerWidth = rect.width - padding * 2;
    const tileSize = (innerWidth - gap * (size - 1)) / size;
    const bgSize = tileSize * size;
    console.log(innerWidth, tileSize);

    board.forEach((num, idx) => {
        const tile = document.createElement("div");
        tile.className = "tile";

        if (num === null) {
            tile.classList.add("empty");
        } else if (debug || !imageReady) {
            tile.textContent = num;
            tile.style.background = "var(--bg-3)";
            tile.style.color = "var(--ink-0)";
        } else {
            const row = Math.floor((num - 1) / size);
            const col = (num - 1) % size;
            // Pixel-exact offsets: place the (col, row) tile of an
            // (size x size) sliced image into this cell.
            tile.style.backgroundImage = `url(${imgURL})`;
            tile.style.backgroundSize = `${bgSize}px ${bgSize}px`;
             tile.style.backgroundPosition = `${-col * tileSize}px ${-row * tileSize}px`;
            tile.style.backgroundRepeat = "no-repeat";

            if (debug) tile.textContent = num;
        }

        tile.addEventListener("click", () => handleMove(idx));
        container.appendChild(tile);
    });
}

function handleMove(clickedIndex) {
    const emptyIndex = board.indexOf(null);
    if (!isAdjacent(clickedIndex, emptyIndex)) return;

    [board[clickedIndex], board[emptyIndex]] =
        [board[emptyIndex], board[clickedIndex]];
    moves++;
    movesEl.textContent = moves;
    drawBoard();

    const movedTile = container.children[emptyIndex];
    if (movedTile) {
        movedTile.classList.add("move-anim");
        setTimeout(() => movedTile.classList.remove("move-anim"), 350);
    }

    if (checkWin()) onWin();
}

function isAdjacent(i1, i2) {
    const x1 = i1 % size, y1 = Math.floor(i1 / size);
    const x2 = i2 % size, y2 = Math.floor(i2 / size);
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function checkWin() {
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i] !== i + 1) return false;
    }
    return true;
}

function onWin() {
    stopTimer();
    const finalTime = elapsed;
    const isRecord  = saveBestTime(size, finalTime);


    [...container.children].forEach((t, i) => {
        if (i < container.children.length - 1) {
            t.style.animationDelay = `${i * 0.02}s`;
            t.classList.add("solved-pulse");
        }
    });

    setTimeout(() => {
        winTime.textContent  = formatTime(finalTime);
        winMoves.textContent = moves;
        winGrid.textContent  = `${size}×${size}`;
        winBadge.textContent = isRecord ? "New Record" : "Solved";
        winBadge.classList.toggle("is-record", isRecord);
        winOverlay.hidden = false;
        startConfetti();
    }, 700);
}

function closeWin() {
    winOverlay.hidden = true;
    stopConfetti();
}

let confettiRAF = null;
let confettiParticles = [];

function startConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    confettiCanvas.width  = window.innerWidth  * dpr;
    confettiCanvas.height = window.innerHeight * dpr;
    confettiCanvas.style.width  = window.innerWidth  + "px";
    confettiCanvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);

    const colors = ["#e8a04c", "#ff7a3d", "#f4ede0", "#b8d68c", "#88c0d0"];
    confettiParticles = Array.from({ length: 140 }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle"
    }));

    const tick = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiParticles.forEach(p => {
            p.vy += 0.35;        // gravity
            p.vx *= 0.99;        // drag
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.life -= 0.005;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            if (p.shape === "rect") {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        confettiParticles = confettiParticles.filter(
            p => p.life > 0 && p.y < window.innerHeight + 50
        );
        if (confettiParticles.length > 0) {
            confettiRAF = requestAnimationFrame(tick);
        }
    };
    confettiRAF = requestAnimationFrame(tick);
}
function stopConfetti() {
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = null;
    const ctx = confettiCanvas.getContext("2d");
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

startBtn.addEventListener("click", async () => {
    showScreen("game");
    await initGame(true);
});

backBtn.addEventListener("click", () => {
    showScreen("start");
});

restartBtn.addEventListener("click", () => initGame(true));

winAgainBtn.addEventListener("click", async () => {
    closeWin();
    await initGame(true);
});
winMenuBtn.addEventListener("click", () => {
    closeWin();
    showScreen("start");
});

let resizeT;
window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
        if (!gameScreen.hidden && board.length) drawBoard();
    }, 120);
});

document.addEventListener("keydown", (e) => {
    if (gameScreen.hidden) return;
    const empty = board.indexOf(null);
    const x = empty % size, y = Math.floor(empty / size);
    let target = -1;
    if (e.key === "ArrowUp"    && y < size - 1) target = empty + size;
    if (e.key === "ArrowDown"  && y > 0)        target = empty - size;
    if (e.key === "ArrowLeft"  && x < size - 1) target = empty + 1;
    if (e.key === "ArrowRight" && x > 0)        target = empty - 1;
    if (target >= 0) {
        e.preventDefault();
        handleMove(target);
    }
});

showScreen("start");
renderBestTimes();