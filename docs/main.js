// src/game-of-life/engine/GameOfLifeEngine.ts
class GameOfLifeEngine {
  grid;
  grid_size;
  player_area_size;
  generation = 0;
  budget = 0;
  game_over = false;
  isPaused = false;
  core_cells = [];
  player_bounds = [0, 0];
  chaos_reinature_timer = 0;
  birth_history = [];
  max_history = 20;
  constructor(grid_size, player_area_size = 24, initial_probability = 0.3) {
    this.grid_size = grid_size;
    this.player_area_size = player_area_size;
    this.grid = Array.from({ length: grid_size }, () => Array(grid_size).fill(false));
    this.setupGame(initial_probability);
  }
  setupGame(initial_probability) {
    const start = Math.max(0, Math.floor((this.grid_size - this.player_area_size) / 2));
    const end = Math.min(this.grid_size, start + this.player_area_size);
    this.player_bounds = [start, end];
    this.randomize(initial_probability);
    for (let r = start;r < end; r++) {
      for (let c = start;c < end; c++) {
        this.grid[r][c] = false;
      }
    }
    const core_start = Math.floor((this.grid_size - 2) / 2);
    const core_end = core_start + 2;
    this.core_cells = [];
    for (let r = core_start;r < core_end; r++) {
      for (let c = core_start;c < core_end; c++) {
        this.grid[r][c] = true;
        this.core_cells.push([r, c]);
      }
    }
    this.generation = 0;
    this.budget = 10;
    this.game_over = false;
  }
  randomize(probability) {
    for (let r = 0;r < this.grid_size; r++) {
      for (let c = 0;c < this.grid_size; c++) {
        this.grid[r][c] = Math.random() < probability;
      }
    }
  }
  update() {
    if (this.isPaused || this.game_over)
      return;
    const nextGrid = Array.from({ length: this.grid_size }, () => Array(this.grid_size).fill(false));
    let birthCount = 0;
    for (let r = 0;r < this.grid_size; r++) {
      for (let c = 0;c < this.grid_size; c++) {
        const neighbors = this.countNeighbors(r, c);
        const isAlive = this.grid[r][c];
        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          nextGrid[r][c] = true;
        } else if (!isAlive && neighbors === 3) {
          nextGrid[r][c] = true;
          birthCount++;
          this.recordBirth(r, c);
        } else {
          nextGrid[r][c] = false;
        }
      }
    }
    this.grid = nextGrid;
    this.generation++;
    this.budget += 0.1;
    this.checkGameOver();
  }
  countNeighbors(r, c) {
    let count = 0;
    for (let i = -1;i <= 1; i++) {
      for (let j = -1;j <= 1; j++) {
        if (i === 0 && j === 0)
          continue;
        const nr = r + i;
        const nc = c + j;
        if (nr >= 0 && nr < this.grid_size && nc >= 0 && nc < this.grid_size) {
          if (this.grid[nr][nc])
            count++;
        }
      }
    }
    return count;
  }
  recordBirth(r, c) {
    if (this.birth_history.length >= this.max_history) {
      this.birth_history.shift();
    }
    this.birth_history.push({ gen: this.generation, r, c });
  }
  handleAddCell(x, y, cellSize) {
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);
    if (r >= 0 && r < this.grid_size && c >= 0 && c < this.grid_size) {
      if (this.budget >= 1 && !this.grid[r][c]) {
        this.grid[r][c] = true;
        this.budget -= 1;
      }
    }
  }
  checkGameOver() {
    for (const [r, c] of this.core_cells) {
      if (!this.grid[r][c]) {
        this.game_over = true;
        return;
      }
    }
  }
}

// src/game-of-life/renderer/GameRenderer.ts
class GameRenderer {
  ctx;
  canvas;
  grid_size;
  cell_size;
  ui_width;
  grid_area_size;
  bg_color = "#141414";
  grid_line_for_color = "#1e1e1e";
  cell_color_alive = "#006400";
  cell_color_core = "#ffd700";
  text_color = "#c8c8c8";
  player_area_color = "#282828";
  constructor(canvas, grid_size, cell_size, ui_width) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.grid_size = grid_size;
    this.cell_size = cell_size;
    this.ui_width = ui_width;
    this.grid_area_size = grid_size * cell_size;
    this.canvas.width = this.grid_area_size + this.ui_width;
    this.canvas.height = this.grid_area_size;
  }
  draw(engine, fps) {
    const { ctx, canvas, grid_size, cell_size, ui_width, grid_area_size } = this;
    ctx.fillStyle = this.bg_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const [start, end] = engine.player_bounds;
    ctx.fillStyle = this.player_area_color;
    ctx.fillRect(start * cell_size, start * cell_size, (end - start) * cell_size, (end - start) * cell_size);
    for (let r = 0;r < grid_size; r++) {
      for (let c = 0;c < grid_size; c++) {
        if (engine.grid[r][c]) {
          const isCore = engine.core_cells.some((cell) => cell[0] === r && cell[1] === c);
          ctx.fillStyle = isCore ? this.cell_color_core : this.cell_color_alive;
          ctx.fillRect(c * cell_size + 1, r * cell_size + 1, cell_size - 2, cell_size - 2);
        }
      }
    }
    ctx.strokeStyle = this.grid_line_for_color;
    ctx.lineWidth = 0.5;
    for (let i = 0;i <= grid_size; i++) {
      const pos = i * cell_size;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, grid_area_size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(grid_area_size, pos);
      ctx.stroke();
    }
    const ui_x = grid_area_size + 15;
    ctx.fillStyle = this.text_color;
    ctx.font = "16px Arial";
    ctx.fillText(`Gen: ${engine.generation}`, ui_x, 30);
    ctx.fillText(`Budget: ${Math.floor(engine.budget)}`, ui_x, 60);
    if (engine.game_over) {
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 24px Arial";
      ctx.fillText("GAME OVER", ui_x, 120);
    }
    ctx.fillStyle = this.text_color;
    ctx.font = "12px Arial";
    const controls = [
      "Controls:",
      "Space: Toggle Pause",
      "R: Reset",
      "Mouse: Place Cell (Costs 1)"
    ];
    controls.forEach((text, i) => {
      ctx.fillText(text, ui_x, 180 + i * 20);
    });
  }
}

// src/game-of-life/input/InputHandler.ts
class InputHandler {
  engine;
  renderer;
  canvas;
  cell_size;
  constructor(engine, renderer, canvas, cell_size) {
    this.engine = engine;
    this.renderer = renderer;
    this.canvas = canvas;
    this.cell_size = cell_size;
    this.setupListeners();
  }
  setupListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.engine.handleAddCell(x, y, this.cell_size);
    });
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "Space":
          this.engine.isPaused = !this.engine.isPaused;
          break;
        case "KeyR":
          this.engine.setupGame(0.3);
          break;
      }
    });
  }
}

// src/game-of-life/main.ts
var GRID_SIZE = 50;
var CELL_SIZE = 10;
var UI_WIDTH = 200;
function main() {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas)
    return;
  const engine = new GameOfLifeEngine(GRID_SIZE, 24, 0.3);
  const renderer = new GameRenderer(canvas, GRID_SIZE, CELL_SIZE, UI_WIDTH);
  new InputHandler(engine, renderer, canvas, CELL_SIZE);
  let lastTime = 0;
  let fps = 0;
  function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    if (deltaTime > 0) {
      fps = 1000 / deltaTime;
    }
    lastTime = timestamp;
    engine.update();
    renderer.draw(engine, fps);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
if (document.readyState === "complete" || document.readyState === "interactive") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
