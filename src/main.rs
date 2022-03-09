use rust_wasm_tut::World;

fn main() {
    let mut w = World::new_random(10, 10);
    println!("{}", w);
    w.tick();
    println!("{}", w);
    w.tick();
    println!("{}", w);
    w.tick();
    println!("{}", w);
    w.tick();
    println!("{}", w);
}