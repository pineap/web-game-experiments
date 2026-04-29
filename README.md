# Web Game Experiments

A collection of lightweight, experimental web games built with HTML, CSS, and JavaScript.

## Goal
To explore game mechanics, physics, and rendering techniques using minimal-dependency web technologies.

## Project Structure
- `index.html`: The main entry point and dashboard for all experiments.
- `style.css`: Global styles for the portal.
- `script.js`: Global logic (if any).
- `_data/games.json`: The "database" of all games in the collection.
- `[experiment-name]/`: Individual game folders.

## Deployment (GitHub Pages)

This project uses **Eleventy (11ty)** to generate the static site. Before pushing changes to GitHub, you must generate the production build.

### 1. Generate the Build
Run the build command to transform the templates and data into static HTML:
```bash
bunx @11ty/eleventy
```
This will create a `_site` directory containing the final, deployable website.

### 2. Deploy to GitHub
Since GitHub Pages needs to serve the contents of the `_site` folder, you should ensure your deployment process points to that directory. 

*Tip: You can use a GitHub Action to automate this, or simply push the `_site` contents to a `gh-pages` branch.*

## Local Development

To run a local development server with live reloading:
```bash
bunx @11ty/eleventy --serve
```
Once running, visit `http://localhost:8080` in your browser.

## Dependencies
- [Bun](https://bun.sh/): Fast JavaScript runtime and package manager.
- [Eleventy](https://www.11ty.dev/): Simple and fast static site generator.
