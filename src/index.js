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
