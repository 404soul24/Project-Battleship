# Battleship UI Design

## Overview
Add a complete web UI to the existing Battleship game logic, bundled with webpack.

## Architecture
- **Entry point**: `src/index.js` — game state machine (placement → battle → game over)
- **DOM module**: `src/dom.js` — all DOM creation, rendering, event binding
- **Styles**: `src/styles.css` — grid layout, colors, status bar
- **HTML template**: `src/template.html` — base HTML for html-webpack-plugin
- **Build**: webpack 5 with dev server, css-loader, style-loader, html-webpack-plugin

## Game Flow
1. **Placement phase**: Player places 5 ships (lengths 5,4,3,3,2) on their 10x10 grid by clicking a start cell. Orientation toggle (horizontal/vertical) via button. Validates: no overlap, no out-of-bounds. Computer places all ships randomly after player finishes or automatically in parallel.
2. **Battle phase**: Player clicks any unattacked cell on enemy grid → attack registers → if game not over, computer attacks a random unattacked cell on player grid → repeat. Disable enemy grid during computer's "turn" (instant in this version).
3. **Game Over**: Show winner message, enable restart button.

## UI Layout
- Header: game title + dynamic status message
- Two 10x10 grids side by side: "Your Fleet" (left) and "Enemy Waters" (right)
- Control bar below: ships remaining indicator, orientation toggle (placement phase only), restart button

## Rendering Rules
- Player board: ships shown as gray cells, hits as red, misses as white dot
- Enemy board: ships hidden (all cells look water), hits as red X, misses as white dot
- Sunk ships: marked with a darker shade / strikethrough indicator
- Attacked cells: disabled, not clickable

## Data Flow
- `index.js` owns game state: current phase, current ship index, orientation
- `dom.js` reads from Player/Gameboard objects to render grids
- Click events in `dom.js` call handlers in `index.js` which mutate game state and trigger re-render

## Key Game Logic Fixes
- `Gameboard.placeShip`: add boundary and overlap validation
- `Gameboard.receiveAttack`: track hits separately (not just on ship), prevent re-attacking same cell
- Track attacked cells set to avoid duplicate attacks

## Files to Create/Modify
- **New**: `webpack.config.js`, `src/template.html`, `src/styles.css`
- **Modify**: `src/dom.js`, `src/index.js`, `src/components/Gameboard.js`, `package.json`
