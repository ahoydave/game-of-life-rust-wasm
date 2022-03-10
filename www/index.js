import { World, Cell, init, make_panic } from "rust-wasm-tut";
import { memory } from "rust-wasm-tut/rust_wasm_tut_bg";

init();
//make_panic();

const CELL_SIZE = 5;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const WORLD_SIZE = 200;
const TICKS_PER_SECOND = 50;

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
    w.tick();
}, 1000/TICKS_PER_SECOND);

let last_frame_timestamp = performance.now();
const fps_element = document.getElementById("fps");

const renderLoop = () => {
    const now = performance.now();
    const delta = now - last_frame_timestamp;
    last_frame_timestamp = now;
    fps_element.textContent = `FPS: ${Math.round(1000/delta)}`.trim();

    draw_game();
    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);