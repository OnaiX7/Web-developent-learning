const square = document.getElementById("square");
const box = document.getElementById("box");

let x = 0;
let y = 0;

const step = 20;
const squareSize = 50;
const boxSize = 700;

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
        x += step;
    } else if (event.key === "ArrowLeft") {
        x -= step;
    } else if (event.key === "ArrowDown") {
        y += step;
    } else if (event.key === "ArrowUp") {
        y -= step;
    }
});