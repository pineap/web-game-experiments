# Web Game Experiments

A collection of lightweight, experimental web games built with HTML, CSS, and JavaScript.

## Goal
To explore game mechanics, physics, and rendering techniques using minimal-dependency web technologies.

## Project Structure
- `index.html`: The main entry point and dashboard for all experiments.
- `style.css`: Global styles for the HTML dashboard.
- `_data/games.json`: The "database" of all games in the collection.
- `src/`: The TypeScript source code for individual games.
- `tsconfig.json`: TypeScript configuration.
- `docs/`: The generated production-ready static site (served by GitHub Pages).

## Deployment (GitHub Pages)

This project uses **Eleventy (11ty)** to generate the HTML dashboard and **Bun** to bundle the TypeScript game logic. All production files are generated directly into the `/docs` folder for GitHub Pages hosting.

### 1. Generate the Build
Run the build command to bundle the TypeScript games and generate the static HTML:
```bash
bun run build
```
This will:
1. Run `bun build` to compile `src/game.ts` into `docs/game/game.js`.
2. Run `eleventy` to generate the HTML and place it into the `docs/` directory.

The `docs` folder is now ready to be pushed to GitHub.


## Local Development

To run a local development server with live reloading:
```bash
bunx @11ty/eleventy --serve
```
Once running, visit `http://localhost:8080` in your browser.

## Dependencies
- [Bun](https://bun.sh/): Fast JavaScript runtime and package manager.
- [Eleventy](https://www.11ty.dev/): Simple and fast static site generator.
