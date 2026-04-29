import './style.css';
import { GameOfLifeEngine } from './engine/GameOfLifeEngine';
import { GameRenderer } from './renderer/GameRenderer';
import { InputHandler } from './input/InputHandler';

const GRID_SIZE = 50;
const CELL_SIZE = 10;
const UI_WIDTH = 200;

function main() {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const engine = new GameOfLifeEngine(GRID_SIZE, 24, 0.3);
    const renderer = new GameRenderer(canvas, GRID_SIZE, CELL_SIZE, UI_WIDTH);
    new InputHandler(engine, renderer, canvas, CELL_SIZE);

    let lastTime = 0;
    let fps = 0;

    function loop(timestamp: number) {
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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}
