import * as wasm from "rust-wasm-tut";

wasm.greet("Eleni and Dave");

let w = wasm.World.new_random(100, 100);
let debug_elem = document.getElementById("game-of-life-debug");
debug_elem.innerHTML = w.render();

setInterval(() => {
    w.tick();
    debug_elem.innerHTML = w.render();
}, 300);