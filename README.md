# Web Game Experiments

A collection of lightweight, experimental web games.

## Tech Stack
- **Runtime & Bundler**: [Bun](https://bun.sh/)
- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/)
- **Rendering**: [PixiJS](https://pixijs.com/) (for some experiments)
- **Language**: TypeScript

## Project Structure
- `index.html`: Main entry point / dashboard.
- `src/`: TypeScript source code for individual games.
- `docs/`: The generated production-ready static site (served by GitHub Pages).

## Deployment (GitHub Pages)

This project generates all production files directly into the `/docs` folder.

### 1. Generate the Build
Run the build command to bundle the TypeScript games and generate the static HTML:
```bash
bun run build
```

The `docs` folder is now ready to be pushed to GitHub.

## Local Development

To run a local development server:
```bash
bun run start&build
```
Once running, visit `http://localhost:8080` in your browser.

