import * as wasm from "rust-wasm-tut";
import { memory } from "rust-wasm-tut/rust_wasm_tut_bg";

wasm.init();
//make_panic();

const CELL_SIZE = 5;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const WORLD_SIZE = 300;
const TICKS_PER_FRAME = 10;

const w = wasm.World.new_random(WORLD_SIZE, WORLD_SIZE);
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
            if (cells[i] === wasm.Cell.Alive) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            };
        }
    }
};

const tick_time_element = document.getElementById("tick_time");
const fps_element = document.getElementById("fps");
const gen_count_element = document.getElementById("generation_count");

const ticks_per_frame_element = document.getElementById("ticks_per_frame_input");
ticks_per_frame_element.value = TICKS_PER_FRAME;
let ticks_per_frame = TICKS_PER_FRAME;
ticks_per_frame_element.onblur = (e) => {
    let new_tpf = parseInt(e.target.value);
    if (!isNaN(new_tpf)) {
        ticks_per_frame = new_tpf;
        console.log(`Updating ticks per frame to ${new_tpf}`);
    } else {
        console.log("new tfp is a NaN");
        e.value = ticks_per_frame;
    };
};

let play = false;
const play_button = document.getElementById("play_button");
play_button.onclick = (e) => {
    if (play) {
        play = false;
        play_button.textContent = "Play";
    } else {
        play = true;
        play_button.textContent = "Stop";
        requestAnimationFrame(renderLoop);
    }
};

let generation_count = 0;
let last_frame_timestamp = performance.now();

const update_world = () => {
    const start = performance.now();
    for (let i = 0; i < ticks_per_frame; i++) { 
        w.tick();
        generation_count++;
    }
    const end = performance.now();
    tick_time_element.textContent = `Update Time: ${Math.round(end - start)}ms`;
};

const renderLoop = () => {
    const now = performance.now();
    const delta = now - last_frame_timestamp;
    last_frame_timestamp = now;
    fps_element.textContent = `FPS: ${Math.round(1000/delta)}`;
    gen_count_element.textContent = `Generation: ${generation_count}`;

    draw_game();
    update_world();
    if (play) {
        requestAnimationFrame(renderLoop);
    };
};

requestAnimationFrame(renderLoop);