import * as wasm from "rust-wasm-tut";
import { memory } from "rust-wasm-tut/rust_wasm_tut_bg";
import { Renderer } from "./render.js";

wasm.init();
//make_panic();

const CELL_SIZE = 5;
const WORLD_SIZE = 300;
const TICKS_PER_FRAME = 10;

const w = wasm.World.new_random(WORLD_SIZE, WORLD_SIZE);
const cells_ptr = w.get_cells_ptr();
const cells = new Uint8Array(memory.buffer, cells_ptr, w.width * w.height);

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = w.width * CELL_SIZE;
canvas.height = w.height * CELL_SIZE;
const ctx = canvas.getContext("2d");

const renderer = new Renderer(ctx, w.width, w.height, CELL_SIZE);

let draw_game = () => {
    const cells_ptr = w.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cells_ptr, w.width * w.height);
    renderer.render(cells);
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