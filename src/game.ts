import { Application, Graphics } from 'pixi.js';

async function init() {
    // Create a new application
    const app = new Application();

    // Initialize the application context
    await app.init({ 
        background: '#1099bb', 
        resizeTo: window 
    });

    // Add the canvas to the HTML document
    document.body.appendChild(app.canvas);

    // Create a simple graphics object (a white square)
    const graphics = new Graphics()
        .rect(0, 0, 100, 100)
        .fill(0xffffff);

    // Center the square in the middle of the screen
    graphics.x = app.screen.width / 2 - 50;
    graphics.y = app.screen.height / 2 - 50;

    // Add the graphics object to the stage
    app.stage.addChild(graphics);

    console.log('PixiJS initialized successfully!');
}

init();
