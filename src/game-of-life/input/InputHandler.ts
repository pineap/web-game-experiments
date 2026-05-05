import { GameOfLifeEngine } from "../engine/GameOfLifeEngine";
import { GameRenderer } from "../renderer/GameRenderer";

export class InputHandler {
    constructor(
        private engine: GameOfLifeEngine,
        private renderer: GameRenderer,
        private canvas: HTMLCanvasableElement,
        private cell_size: number
    ) {
        this.setupListeners();
    }

    private setupListeners() {
        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.engine.handleAddCell(x, y, this.cell_size);
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.code) {
                case 'Space':
                    this.engine.isPaused = !this.engine.isPaused;
                    break;
                case 'KeyR':
                    this.engine.setupGame(0.3);
                    break;
                case 'KeyD':
                    this.engine.generation_ms = Math.min(this.engine.generation_ms * 2, this.engine.max_gen_period);
                    break;
                case 'KeyA':
                    this.engine.generation_ms = Math.max(this.engine.generation_ms / 2, this.engine.min_gen_period);
                    break;
            }
        });
    }
}
