# Conway's Game of Life - Playing with Rust, Wasm, WebGL

A tech demo based on https://rustwasm.github.io/docs/book/game-of-life/introduction.html

## What is going on in this repo

### Following the tutorial

The tutorial above codes the game world logic in Rust. This is then compiled with wasm-pack with javascript bindings magically created by wasm-bindgen.

In the `www` directory there is a simple js frontend that uses the wasm bindings to set up a GoL world and then loop, updating and rendering it onto an html canvas element.

The rust library is based on the https://github.com/rustwasm/wasm-pack-template and the frontend on https://github.com/rustwasm/create-wasm-app.

### WebGL Render Extension

Since drawing little rectangles to the canvas was taking a pretty big chunk of time in the update/render loop (TODO: add profiling picture), I added a WebGL renderer instead that draws `POINT` primitives for each cell - this changes things so that the update/render step is dominated by the updating logic.

This was heavily based on the excellent https://webgl2fundamentals.org/