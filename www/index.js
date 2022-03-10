import { World, Cell, init, make_panic } from "rust-wasm-tut";
import { memory } from "rust-wasm-tut/rust_wasm_tut_bg";

init();
//make_panic();

const CELL_SIZE = 5;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const WORLD_SIZE = 300;
const TICKS_PER_SECOND = 10;
const TICKS_PER_FRAME = 10;

const w = World.new_random(WORLD_SIZE, WORLD_SIZE);
const world_width = w.width;
const world_height = w.height;

const cells_ptr = w.get_cells_ptr();
const cells = new Uint8Array(memory.buffer, cells_ptr, world_width * world_height);

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = world_width * CELL_SIZE;
canvas.height = world_height * CELL_SIZE;
const ctx = canvas.getContext("2d");

let draw_game = () => {
    ctx.fillStyle = DEAD_COLOR;
    ctx.fillRect(0, 0, world_width * CELL_SIZE, world_height * CELL_SIZE);

    const cells_ptr = w.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cells_ptr, world_width * world_height);

    ctx.fillStyle = ALIVE_COLOR;

    for (let y = 0; y < world_height; y++) {
        for (let x = 0; x < world_width; x++) {
            let i = x + y * world_width;
            if (cells[i] === Cell.Alive) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            };
        }
    }
};

const tick_time_element = document.getElementById("tick_time");
let generation_count = 0;

const update_world = () => {
    generation_count++;
    console.log(`Starting update gen ${generation_count}`);
    const start = performance.now();
    for (let i = 0; i < TICKS_PER_FRAME; i++) 
        w.tick();
    const end = performance.now();
    tick_time_element.textContent = `Tick Time: ${Math.round(end - start)}ms`;
    console.log(`Ending update gen ${generation_count}`)
};

//setInterval(update_world, 1000/TICKS_PER_SECOND);

let play = false;

let last_frame_timestamp = performance.now();
const fps_element = document.getElementById("fps");

let last_gen = generation_count;

const renderLoop = () => {
    console.log(`Gens per render: ${generation_count - last_gen}`);
    last_gen = generation_count;
    const now = performance.now();
    const delta = now - last_frame_timestamp;
    last_frame_timestamp = now;
    fps_element.textContent = `FPS: ${Math.round(1000/delta)}`;

    draw_game();
    update_world();
    if (play) {
        requestAnimationFrame(renderLoop);
    };
};

requestAnimationFrame(renderLoop);

const play_button = document.getElementById("play_button");
play_button.onclick = (e) => {
    if (play) {
        play = false;
    } else {
        play = true;
        requestAnimationFrame(renderLoop);
    }
};