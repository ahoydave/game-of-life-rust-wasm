import { World, Cell } from "rust-wasm-tut";
import { memory } from "rust-wasm-tut/rust_wasm_tut_bg";

const CELL_SIZE = 5;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const WORLD_SIZE = 200;

let w = World.new_random(WORLD_SIZE, WORLD_SIZE);

const cells_ptr = w.get_cells_ptr();
const cells = new Uint8Array(memory.buffer, cells_ptr, w.width * w.height);

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = w.width * CELL_SIZE;
canvas.height = w.height * CELL_SIZE;
const ctx = canvas.getContext("2d");

let draw_game = () => {
    ctx.fillStyle = DEAD_COLOR;
    ctx.fillRect(0, 0, w.width * CELL_SIZE, w.height * CELL_SIZE);

    const cells_ptr = w.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cells_ptr, w.width * w.height);

    ctx.fillStyle = ALIVE_COLOR;

    for (let y = 0; y < w.height; y++) {
        for (let x = 0; x < w.width; x++) {
            let i = x + y * w.width;
            if (cells[i] === Cell.Alive) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            };
        }
    }
};

setInterval(() => {
    draw_game();
    w.tick();
}, 100);