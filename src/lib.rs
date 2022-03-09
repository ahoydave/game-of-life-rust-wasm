mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(s: &str) {
    alert(&format!("Hello, {}", s));
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct World {
    height: usize,
    width: usize,
    cells: Vec<Cell>,
}

use std::fmt;

impl fmt::Display for World {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for y in 0..self.height {
            for x in 0..self.width {
                write!(
                    f,
                    "{}",
                    match self.cell_alive(x, y) {
                        false => "◻",
                        true => "◼",
                    }
                )
                .expect("Couldn't write out World");
            }
            writeln!(f, "").expect("Couldn't write out World");
        }
        Ok(())
    }
}

use rand::Rng;

#[wasm_bindgen]
impl World {
    pub fn from(ints: &[u8], height: usize, width: usize) -> World {
        let cells: Vec<Cell> = ints
            .iter()
            .map(|x| if *x == 0 { Cell::Dead } else { Cell::Alive })
            .collect();
        World {
            height,
            width,
            cells,
        }
    }

    pub fn new_random(height: usize, width: usize) -> World {
        let mut rng = rand::thread_rng();
        let cells: Vec<Cell> = (0..(height * width))
            .map(|_| if rng.gen() { Cell::Dead } else { Cell::Alive })
            .collect();
        World {
            height,
            width,
            cells,
        }
    }

    fn alive_neighbours(&self, x_pos: usize, y_pos: usize) -> u8 {
        let mut count = 0;
        // add the height or width to the index to make it wrap around to "subtract"
        for x in [x_pos + self.width - 1, x_pos, x_pos + 1] {
            for y in [y_pos + self.height - 1, y_pos, y_pos + 1] {
                if x_pos != x || y_pos != y {
                    count += self.cells[x % self.width + self.width * (y % self.height)] as u8;
                };
            }
        }
        count
    }

    pub fn cell_alive(&self, x_pos: usize, y_pos: usize) -> bool {
        self.cells[x_pos + self.width * y_pos] == Cell::Alive
    }

    pub fn tick(&mut self) {
        let mut new_cells = self.cells.clone();
        for y in 0..self.height {
            for x in 0..self.width {
                new_cells[y * self.height + x] =
                    if self.cell_alive(x, y) && self.alive_neighbours(x, y) < 2 {
                        Cell::Dead
                    } else if self.cell_alive(x, y)
                        && (self.alive_neighbours(x, y) == 2 || self.alive_neighbours(x, y) == 3)
                    {
                        Cell::Alive
                    } else if !self.cell_alive(x, y) && self.alive_neighbours(x, y) == 3 {
                        Cell::Alive
                    } else {
                        Cell::Dead
                    }
            }
        }
        self.cells = new_cells;
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn alive_neighbours_test() {
        let w = World::from(&[0, 1, 0, 1, 1, 0, 1, 0, 0], 3, 3);
        assert_eq!(3, w.alive_neighbours(1, 1));
        assert_eq!(3, w.alive_neighbours(1, 0));
        assert_eq!(4, w.alive_neighbours(2, 2));
        assert_eq!(4, w.alive_neighbours(0, 0));
    }

    /// Rule 1: Any live cell with fewer than two live neighbours
    /// dies, as if caused by underpopulation.
    #[test]
    fn world_tick_rule_1_test() {
        let mut w = World::from(&[0, 0, 0, 1, 1, 0, 0, 0, 0], 3, 3);
        w.tick();
        assert_eq!(World::from(&[0, 0, 0, 0, 0, 0, 0, 0, 0], 3, 3), w);
    }

    /// Rule 2: Any live cell with two or three live neighbours
    /// lives on to the next generation.
    #[test]
    fn world_tick_rule_2_test() {
        let mut w = World::from(&[1, 0, 0, 0, 1, 0, 0, 0, 1], 3, 3);
        w.tick();
        assert_eq!(Cell::Alive, w.cells[4]);
    }

    /// Rule 3: Any live cell with more than three live  
    /// neighbours dies, as if by overpopulation.
    #[test]
    fn world_tick_rule_3_test() {
        let mut w = World::from(&[1, 1, 0, 1, 1, 0, 0, 0, 1], 3, 3);
        w.tick();
        assert_eq!(Cell::Dead, w.cells[4]);
    }

    /// Rule 4: Any dead cell with exactly three live neighbours
    /// becomes a live cell, as if by reproduction.
    #[test]
    fn world_tick_rule_4_test() {
        let mut w = World::from(&[0, 1, 0, 1, 0, 0, 0, 0, 1], 3, 3);
        w.tick();
        assert_eq!(Cell::Alive, w.cells[4]);
    }

    /// Otherwise remain the same
    #[test]
    fn world_tick_rule_4_test_2() {
        let mut w = World::from(&[0, 0, 0, 1, 0, 0, 0, 0, 1], 3, 3);
        w.tick();
        assert_eq!(Cell::Dead, w.cells[4]);
    }

    /// Otherwise remain the same
    #[test]
    fn world_tick_rule_4_test_3() {
        let mut w = World::from(&[1, 1, 0, 1, 0, 0, 0, 0, 1], 3, 3);
        w.tick();
        assert_eq!(Cell::Dead, w.cells[4]);
    }
}
