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

      const canClick = (phase === 'placement' && !isEnemy && !attacked) || (phase === 'battle' && isEnemy && !attacked);
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

export function renderControls(phase, ships, orientation, onSelectShip, onToggle, onRestart, placedShips) {
  const app = document.getElementById('app');
  let controls = app.querySelector('.controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'controls';
    app.appendChild(controls);
  }
  controls.innerHTML = '';

  if (phase === 'placement') {
    const label = document.createElement('span');
    label.id = 'ship-indicator';
    label.textContent = 'Pick a ship to place:';
    controls.appendChild(label);

    for (const size of ships) {
      const alreadyPlaced = placedShips.filter(s => s.length === size).length >= (size === 3 ? 2 : 1);
      const btn = document.createElement('button');
      btn.textContent = `${'■'.repeat(size)} ${size}`;
      btn.disabled = alreadyPlaced;
      btn.addEventListener('click', () => onSelectShip(size));
      controls.appendChild(btn);
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = orientation === 'horizontal' ? '⟷ Horizontal' : '↕ Vertical';
    toggleBtn.addEventListener('click', onToggle);
    controls.appendChild(toggleBtn);

    const autoBtn = document.createElement('button');
    autoBtn.textContent = 'Auto-place';
    autoBtn.addEventListener('click', onRestart);
    controls.appendChild(autoBtn);
  }

  if (phase === 'battle') {
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.addEventListener('click', onRestart);
    controls.appendChild(restartBtn);
  }

  if (phase === 'gameover') {
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.addEventListener('click', onRestart);
    controls.appendChild(restartBtn);
  }
}

export function setCellClickHandler(handler) {
  cellClickHandler = handler;
}
