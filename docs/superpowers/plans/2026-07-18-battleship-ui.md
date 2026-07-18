# Battleship UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete web UI to the existing Battleship game logic, bundled with webpack.

**Architecture:** Standard webpack project with separate CSS/HTML/DOM files. `index.js` manages game state machine (placement → battle → game over), `dom.js` handles all DOM rendering and events, `styles.css` provides styling.

**Tech Stack:** Vanilla JS (ES modules), webpack 5, html-webpack-plugin, css-loader, style-loader

## Global Constraints

- Keep existing test suite passing (Jest)
- No additional runtime dependencies beyond webpack toolchain
- Game logic must validate boundaries and prevent duplicate attacks

---

### Task 1: Webpack and Build Setup

**Files:**
- Create: `webpack.config.js`
- Create: `src/template.html`
- Modify: `package.json` (add build scripts and devDependencies)

**Interfaces:**
- Produces: Build pipeline that bundles `src/index.js` → `dist/` with injected HTML

- [ ] **Step 1: Install webpack dependencies**

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader
```

- [ ] **Step 2: Create `webpack.config.js`**

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

- [ ] **Step 3: Create `src/template.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Battleship</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

- [ ] **Step 4: Update `package.json` scripts**

```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "build": "webpack",
  "dev": "webpack serve --open"
}
```

- [ ] **Step 5: Verify build works**

```bash
npm run build
```
Expected: `dist/index.html` and `dist/bundle.js` are generated.

---

### Task 2: Gameboard Logic Fixes

**Files:**
- Modify: `src/components/Gameboard.js` (full rewrite)

**Interfaces:**
- Produces: `Gameboard.placeShip(ship, row, col, isHorizontal)` returns `boolean` (success/failure)
- Produces: `Gameboard.receiveAttack(row, col)` returns `'hit'` | `'miss'` | `'duplicate'`
- Produces: `Gameboard.attackedCells` — `Set` of `"row,col"` strings

- [ ] **Step 1: Write failing tests**

```javascript
// src/tests/Gameboard.test.js — add these tests

test("rejects out-of-bounds ship placement", () => {
  const board = new Gameboard();
  const ship = new Ship(3);
  expect(board.placeShip(ship, 9, 8, true)).toBe(false);
  expect(board.placeShip(ship, 8, 9, false)).toBe(false);
});

test("rejects overlapping ship placement", () => {
  const board = new Gameboard();
  const ship1 = new Ship(3);
  const ship2 = new Ship(3);
  board.placeShip(ship1, 2, 3, true);
  expect(board.placeShip(ship2, 2, 4, true)).toBe(false);
});

test("rejects duplicate attack", () => {
  const board = new Gameboard();
  board.receiveAttack(0, 0);
  expect(board.receiveAttack(0, 0)).toBe('duplicate');
});

test("receiveAttack returns 'hit' when ship is hit", () => {
  const board = new Gameboard();
  const ship = new Ship(3);
  board.placeShip(ship, 2, 3, true);
  expect(board.receiveAttack(2, 3)).toBe('hit');
});

test("receiveAttack returns 'miss' when no ship", () => {
  const board = new Gameboard();
  expect(board.receiveAttack(9, 9)).toBe('miss');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

- [ ] **Step 3: Rewrite `src/components/Gameboard.js`**

```javascript
class Gameboard {
  constructor() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null)
    );
    this.missedAttack = [];
    this.ships = [];
    this.attackedCells = new Set();
  }

  placeShip(ship, row, col, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      if (r >= 10 || c >= 10 || this.grid[r][c] !== null) return false;
    }
    for (let i = 0; i < ship.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      this.grid[r][c] = ship;
    }
    this.ships.push(ship);
    return true;
  }

  receiveAttack(row, col) {
    const key = `${row},${col}`;
    if (this.attackedCells.has(key)) return 'duplicate';
    this.attackedCells.add(key);

    const target = this.grid[row][col];
    if (target !== null) {
      target.hit();
      return 'hit';
    }
    this.missedAttack.push([row, col]);
    return 'miss';
  }

  allShipsSunk() {
    return this.ships.length > 0 && this.ships.every(s => s.isSunk());
  }
}

export { Gameboard };
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

---

### Task 3: CSS Styles

**Files:**
- Create: `src/styles.css`

**Interfaces:**
- Produces: Styles consumed by `src/index.js` via `import './styles.css'`

- [ ] **Step 1: Create `src/styles.css`**

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #1a1a2e;
  color: #eee;
  display: flex;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
}

#app {
  text-align: center;
  max-width: 900px;
  width: 100%;
}

h1 {
  font-size: 2rem;
  letter-spacing: 0.2em;
  margin-bottom: 8px;
  color: #e94560;
}

#status {
  font-size: 1.1rem;
  margin-bottom: 16px;
  min-height: 1.5em;
  color: #ccc;
}

.grids {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-container h3 {
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #aaa;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 36px);
  gap: 2px;
  padding: 4px;
  background: #16213e;
  border-radius: 4px;
}

.cell {
  width: 36px;
  height: 36px;
  border: 1px solid #0f3460;
  background: #1a1a3e;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.15s;
}

.cell:hover:not(:disabled) {
  background: #0f3460;
}

.cell:disabled {
  cursor: default;
  opacity: 0.7;
}

.cell.ship {
  background: #5c6bc0;
  border-color: #3949ab;
}

.cell.hit {
  background: #e94560;
  border-color: #c62828;
}

.cell.miss {
  background: #2a2a4e;
  border-color: #555;
  position: relative;
}

.cell.miss::after {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #777;
}

.cell.hit::after {
  content: '✕';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.cell.sunk {
  background: #4a148c;
  border-color: #6a1b9a;
}

.controls {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.controls button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background: #0f3460;
  color: #eee;
  transition: background 0.15s;
}

.controls button:hover {
  background: #1a5276;
}

.controls button:disabled {
  opacity: 0.4;
  cursor: default;
}

#ship-indicator {
  font-size: 0.9rem;
  color: #aaa;
}
```

---

### Task 4: DOM Module

**Files:**
- Modify: `src/dom.js` (full implementation)

**Interfaces:**
- Consumes: `Player` instances with `.board` (Gameboard)
- Consumes: Callbacks from `index.js`: `onCellClick(row, col)`, `onRestart()`
- Produces: `renderGameBoards(humanPlayer, computerPlayer, phase)` renders both grids
- Produces: `updateStatus(text)` updates status line
- Produces: `renderControls(phase, ships, currentShipIndex, orientation, onToggle, onRestart)` renders control bar
- Produces: `setCellClickHandler(handler)` sets the callback for cell clicks

- [ ] **Step 1: Implement `src/dom.js`**

```javascript
let cellClickHandler = null;

export function renderGameBoards(humanPlayer, computerPlayer, phase) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = 'BATTLESHIP';
  app.appendChild(title);

  const status = document.createElement('div');
  status.id = 'status';
  app.appendChild(status);

  const gridsDiv = document.createElement('div');
  gridsDiv.className = 'grids';

  gridsDiv.appendChild(buildGrid('Your Fleet', humanPlayer, phase, false));
  gridsDiv.appendChild(buildGrid('Enemy Waters', computerPlayer, phase, true));

  app.appendChild(gridsDiv);
}

function buildGrid(label, player, phase, isEnemy) {
  const container = document.createElement('div');
  container.className = 'grid-container';

  const heading = document.createElement('h3');
  heading.textContent = label;
  container.appendChild(heading);

  const gridDiv = document.createElement('div');
  gridDiv.className = 'grid';

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      const ship = player.board.grid[r][c];
      const attacked = player.board.attackedCells.has(`${r},${c}`);
      const isMiss = player.board.missedAttack.some(([mr, mc]) => mr === r && mc === c);
      const isHit = attacked && !isMiss;

      if (isHit) {
        cell.classList.add('hit');
        if (ship && ship.isSunk()) cell.classList.add('sunk');
      } else if (isMiss) {
        cell.classList.add('miss');
      } else if (!isEnemy && ship !== null) {
        cell.classList.add('ship');
      }

      const canClick = isEnemy && !attacked && phase === 'battle';
      if (!canClick) cell.disabled = true;

      if (canClick) {
        cell.addEventListener('click', () => {
          if (cellClickHandler) cellClickHandler(r, c);
        });
      }

      gridDiv.appendChild(cell);
    }
  }

  container.appendChild(gridDiv);
  return container;
}

export function updateStatus(text) {
  const el = document.getElementById('status');
  if (el) el.textContent = text;
}

export function renderControls(phase, ships, currentShipIndex, orientation, onToggle, onRestart) {
  const app = document.getElementById('app');
  let controls = app.querySelector('.controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'controls';
    app.appendChild(controls);
  }
  controls.innerHTML = '';

  if (phase === 'placement') {
    const indicator = document.createElement('span');
    indicator.id = 'ship-indicator';
    const remaining = ships.slice(currentShipIndex);
    indicator.textContent = `Ships to place: ${remaining.map(s => '■'.repeat(s)).join(' ')}`;
    controls.appendChild(indicator);

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = orientation === 'horizontal' ? '⟷ Horizontal' : '↕ Vertical';
    toggleBtn.addEventListener('click', onToggle);
    controls.appendChild(toggleBtn);
  }

  if (phase === 'gameover' || phase === 'placement') {
    const restartBtn = document.createElement('button');
    restartBtn.textContent = phase === 'placement' ? 'Auto-place' : 'Restart';
    restartBtn.addEventListener('click', onRestart);
    controls.appendChild(restartBtn);
  }
}

export function setCellClickHandler(handler) {
  cellClickHandler = handler;
}
```

---

### Task 5: Game Entry Point

**Files:**
- Modify: `src/index.js` (full rewrite as game state machine)

**Interfaces:**
- Consumes: `Gameboard.placeShip()` returns boolean
- Consumes: `Gameboard.receiveAttack()` returns 'hit'|'miss'|'duplicate'
- Consumes: All `dom.js` exports
- Produces: Working game

- [ ] **Step 1: Rewrite `src/index.js`**

```javascript
import './styles.css';
import { Player } from './components/Player.js';
import { Ship } from './components/Ship.js';
import {
  renderGameBoards,
  updateStatus,
  renderControls,
  setCellClickHandler,
} from './dom.js';

const SHIP_SIZES = [5, 4, 3, 3, 2];
let humanPlayer, computerPlayer;
let phase = 'placement';
let currentShipIndex = 0;
let orientation = 'horizontal';

function initGame() {
  humanPlayer = new Player('Player');
  computerPlayer = new Player('Computer');
  phase = 'placement';
  currentShipIndex = 0;
  orientation = 'horizontal';
  setCellClickHandler(handlePlacementClick);
  render();
  updateStatus('Place your ships — click a cell to position each one.');
}

function render() {
  renderGameBoards(humanPlayer, computerPlayer, phase);
  renderControls(phase, SHIP_SIZES, currentShipIndex, orientation, toggleOrientation, handleRestart);
}

function handlePlacementClick(row, col) {
  if (phase !== 'placement') return;

  const ship = new Ship(SHIP_SIZES[currentShipIndex]);
  const placed = humanPlayer.board.placeShip(ship, row, col, orientation);

  if (!placed) {
    updateStatus('Cannot place there — try another cell.');
    return;
  }

  currentShipIndex++;

  if (currentShipIndex >= SHIP_SIZES.length) {
    phase = 'battle';
    computerPlayer.board.placeShipsRandomly();
    setCellClickHandler(handleBattleClick);
    updateStatus('All ships placed! Click enemy waters to attack.');
  } else {
    updateStatus(`Place ship of size ${SHIP_SIZES[currentShipIndex]}.`);
  }

  render();
}

function handleBattleClick(row, col) {
  if (phase !== 'battle') return;

  const result = computerPlayer.board.receiveAttack(row, col);
  if (result === 'duplicate') return;

  if (computerPlayer.board.allShipsSunk()) {
    phase = 'gameover';
    render();
    updateStatus('Victory! You sank the entire enemy fleet!');
    renderControls(phase, SHIP_SIZES, currentShipIndex, orientation, toggleOrientation, handleRestart);
    return;
  }

  updateStatus('Computer is thinking...');

  setTimeout(() => {
    const [cr, cc] = computerPlayer.getCoordinates();
    humanPlayer.board.receiveAttack(cr, cc);

    if (humanPlayer.board.allShipsSunk()) {
      phase = 'gameover';
      render();
      updateStatus('Defeat! The computer sank your fleet.');
      renderControls(phase, SHIP_SIZES, currentShipIndex, orientation, toggleOrientation, handleRestart);
      return;
    }

    render();
    updateStatus('Your turn — click enemy waters.');
  }, 600);
}

function toggleOrientation() {
  orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  renderControls(phase, SHIP_SIZES, currentShipIndex, orientation, toggleOrientation, handleRestart);
}

function handleRestart() {
  if (phase === 'placement') {
    for (const ship of humanPlayer.board.ships) {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          if (humanPlayer.board.grid[r][c] === ship) {
            humanPlayer.board.grid[r][c] = null;
          }
        }
      }
    }
    humanPlayer.board.ships = [];
    currentShipIndex = 0;
    phase = 'placement';
    setCellClickHandler(handlePlacementClick);
    updateStatus('Place your ships — click a cell to position each one.');
    render();
  } else {
    initGame();
  }
}

initGame();
```

- [ ] **Step 2: Add `placeShipsRandomly` to `Player` class**

Modify `src/components/Player.js`:

```javascript
import { Gameboard } from './Gameboard.js';
import { Ship } from './Ship.js';

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.pastMoves = [];
  }

  getCoordinates() {
    let row, col, moveKey;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      moveKey = `${row},${col}`;
    } while (this.pastMoves.includes(moveKey));
    this.pastMoves.push(moveKey);
    return [row, col];
  }

  placeShipsRandomly() {
    const sizes = [5, 4, 3, 3, 2];
    for (const size of sizes) {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const isHorizontal = Math.random() < 0.5;
        const ship = new Ship(size);
        placed = this.board.placeShip(ship, row, col, isHorizontal);
      }
    }
  }
}

export { Player };
```

---

### Task 6: Build and Verify

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

- [ ] **Step 2: Run webpack build**

```bash
npm run build
```

- [ ] **Step 3: Verify dist output**

Check `dist/index.html` loads `bundle.js` and the app renders correctly.

- [ ] **Step 4: Commit all changes**

```bash
git add -A
git commit -m "feat: add battleship UI with webpack"
```
