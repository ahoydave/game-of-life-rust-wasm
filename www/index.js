import { World } from "rust-wasm-tut";

const CELL_SIZE = 5;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const WORLD_SIZE = 200;

let w = World.new_random(WORLD_SIZE, WORLD_SIZE);

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = w.width * CELL_SIZE;
canvas.height = w.height * CELL_SIZE;
const ctx = canvas.getContext("2d");

let draw_game = () => {
    for (let y = 0; y < w.height; y++) {
        for (let x = 0; x < w.width; x++) {
            let i = x + y * w.width;
            if (w.cell_alive(x, y)) {
                ctx.fillStyle = ALIVE_COLOR;
            } else {
                ctx.fillStyle = DEAD_COLOR;
            };
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
};

setInterval(() => {
    draw_game();
    w.tick();
}, 100);