import * as wasm from "rust-wasm-tut";

const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

export class Renderer {
    constructor(ctx, world_width, world_height, cell_size) {
        this.ctx = ctx;
        this.world_width = world_width;
        this.world_height = world_height;
        this.cell_size = cell_size;
    }

    render (cells) {
        this.ctx.fillStyle = DEAD_COLOR;
        this.ctx.fillRect(0, 0, this.world_width * this.cell_size, this.world_height * this.cell_size);
    
        this.ctx.fillStyle = ALIVE_COLOR;
    
        for (let y = 0; y < this.world_height; y++) {
            for (let x = 0; x < this.world_width; x++) {
                let i = x + y * this.world_width;
                if (cells[i] === wasm.Cell.Alive) {
                    this.ctx.fillRect(x * this.cell_size, y * this.cell_size, this.cell_size, this.cell_size);
                };
            }
        }
    };
};