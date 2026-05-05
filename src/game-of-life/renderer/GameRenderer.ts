import { GameOfLifeEngine } from "../engine/GameOfLifeEngine";

export class GameRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private grid_size: number;
    private cell_size: number;
    private ui_width: number;
    private grid_area_size: number;
    private bg_color = "#141414";
    private grid_line_for_color = "#1e1e1e";
    private cell_color_alive = "#006400";
    private cell_color_core = "#ffd700";
    private text_color = "#c8c8c8";
    private player_area_color = "#282828";

    constructor(canvas: HTMLCanvasElement, grid_size: number, cell_size: number, ui_width: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.grid_size = grid_size;
        this.cell_size = cell_size;
        this.ui_width = ui_width;
        this.grid_area_size = grid_size * cell_size;
        this.canvas.width = this.grid_area_size + this.ui_width;
        this.canvas.height = this.grid_area_size;
    }

    public draw(engine: GameOfLifeEngine, fps: number) {
        const { ctx, canvas, grid_size, cell_size, ui_width, grid_area_size } = this;
        
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Player Area
        const [start, end] = engine.player_bounds;
        ctx.fillStyle = this.player_area_color;
        ctx.fillRect(
            start * cell_size,
            start * cell_size,
            (end - start) * cell_size,
            (end - start) * cell_size
        );

        // Draw Cells
        for (let r = 0; r < grid_size; r++) {
            for (let c = 0; c < grid_size; c++) {
                if (engine.grid[r][c]) {
                    const isCore = engine.core_cells.some((cell: [number, number]) => cell[0] === r && cell[1] === c);
                    ctx.fillStyle = isCore ? this.cell_color_core : this.cell_color_alive;
                    ctx.fillRect(
                        c * cell_size + 1,
                        r * cell_size + 1,
                        cell_size - 2,
                        cell_size - 2
                    );
                }
            }
        }

        // Draw Grid Lines
        ctx.strokeStyle = this.grid_line_for_color;
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= grid_size; i++) {
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

        // UI Sidebar
        const ui_x = grid_area_size + 15;
        ctx.fillStyle = this.text_color;
        ctx.font = "16px Arial";
        ctx.fillText(`Gen: ${engine.generation}`, ui_x, 30);
        ctx.fillText(`Gen ms: ${engine.generation_ms}`, ui_x, 60);
        ctx.fillText(`Budget: ${Math.floor(engine.budget)}`, ui_x, 90);
        
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
            "Mouse: Place Cell (Costs 1)",
        ];
        controls.forEach((text, i) => {
            ctx.fillText(text, ui_x, 180 + (i * 20));
        });
    }
}
