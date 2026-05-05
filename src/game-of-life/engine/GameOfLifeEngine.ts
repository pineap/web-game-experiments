export class GameOfLifeEngine {
    public grid: boolean[][];
    public grid_size: number;
    public player_area_size: number;
    public generation: number = 0;
    public generation_ms: number = 1000;
    public max_gen_period: number = 8000;
    public min_gen_period: number = 125;
    public budget: number = 0;
    public game_over: boolean = false;
    public isPaused: boolean = false;
    public core_cells: [number, number][] = [];
    public player_bounds: [number, number] = [0, 0];
    private chaos_reinature_timer: number = 0;
    private birth_history: { gen: number, r: number, c: number }[] = [];
    private max_history: number = 20;

    constructor(
        grid_size: number,
        player_area_size: number = 24,
        initial_probability: number = 0.3
    ) {
        this.grid_size = grid_size;
        this.player_area_size = player_area_size;
        this.grid = Array.from({ length: grid_size }, () => Array(grid_size).fill(false));
        this.setupGame(initial_probability);
    }

    public setupGame(initial_probability: number) {
        const start = Math.max(0, Math.floor((this.grid_size - this.player_area_size) / 2));
        const end = Math.min(this.grid_size, start + this.player_area_size);
        this.player_bounds = [start, end];

        this.randomize(initial_probability);

        // Clear Player Area
        for (let r = start; r < end; r++) {
            for (let c = start; c < end; c++) {
                this.grid[r][c] = false;
            }
        }

        // Initialize Core Cells
        const core_start = Math.floor((this.grid_size - 2) / 2);
        const core_end = core_start + 2;
        this.core_cells = [];
        for (let r = core_start; r < core_end; r++) {
            for (let c = core_start; c < core_end; c++) {
                this.grid[r][c] = true;
                this.core_cells.push([r, c]);
            }
        }

        this.generation = 0;
        this.budget = 10;
        this.game_over = false;
    }

    private randomize(probability: number) {
        for (let r = 0; r < this.grid_size; r++) {
            for (let c = 0; c < this.grid_size; c++) {
                this.grid[r][c] = Math.random() < probability;
            }
        }
    }

    public update() {
        if (this.isPaused || this.game_over) return;

        const nextGrid = Array.from({ length: this.grid_size }, () => Array(this.grid_size).fill(false));
        let birthCount = 0;

        for (let r = 0; r < this.grid_size; r++) {
            for (let c = 0; c < this.grid_size; c++) {
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
        this.budget += 0.25; // Regenerate budget slowly

        this.checkGameOver();
    }

    private countNeighbors(r: number, c: number): number {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const nr = r + i;
                const nc = c + j;
                if (nr >= 0 && nr < this.grid_size && nc >= 0 && nc < this.grid_size) {
                    if (this.grid[nr][nc]) count++;
                }
            }
        }
        return count;
    }

    private recordBirth(r: number, c: number) {
        if (this.birth_history.length >= this.max_history) {
            this.birth_history.shift();
        }
        this.birth_history.push({ gen: this.generation, r, c });
    }

    public handleAddCell(x: number, y: number, cellSize: number) {
        const c = Math.floor(x / cellSize);
        const r = Math.floor(y / cellSize);
        
        if (r >= this.player_bounds[0] && r < this.player_bounds[1] && c >= this.player_bounds[0] && c < this.player_bounds[1]) {
            if (this.budget >= 1 && !this.grid[r][c]) {
                this.grid[r][c] = true;
                this.budget -= 1;
            }
        }
    }

    private checkGameOver() {
        // If a core cell dies
        for (const [r, c] of this.core_cells) {
            if (!this.grid[r][c]) {
                this.game_over = true;
                return;
            }
        }
    }
}
