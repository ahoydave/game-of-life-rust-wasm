import { World, Cell } from "rust-wasm-tut";

const CELL_SIZE = 20; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const world_width = 3;
const world_height = 3;
const world_cells = [Cell.Alive, Cell.Alive, Cell.Dead, Cell.Dead, Cell.Dead, Cell.Alive, Cell.Dead, Cell.Alive, Cell.Alive];

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = CELL_SIZE * world_width;
canvas.height = CELL_SIZE * world_height;
const ctx = canvas.getContext("2d");

// ctx.beginPath();
// ctx.strokeStyle = GRID_COLOR;
// ctx.moveTo(10, 10);
// ctx.lineTo(50, 50);
// ctx.stroke();

for (let y = 0; y < world_height; y++) {
    for (let x = 0; x < world_width; x++) {
        let i = x + y * world_width;
        if (world_cells[i] == Cell.Alive) {
            ctx.fillStyle = ALIVE_COLOR;
        } else {
            ctx.fillStyle = DEAD_COLOR;
        };
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
};