export class InputHandler {
    constructor(
        private engine: any,
        private renderer: any,
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
            }
        });
    }
}
