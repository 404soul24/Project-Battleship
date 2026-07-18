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
const SHIP_NAMES = { 5: 'Carrier', 4: 'Battleship', 3: 'Cruiser', 2: 'Destroyer' };
let humanPlayer, computerPlayer;
let phase = 'placement';
let selectedShipSize = null;
let orientation = 'horizontal';
let isProcessing = false;

function initGame() {
  humanPlayer = new Player('Player');
  computerPlayer = new Player('Computer');
  phase = 'placement';
  selectedShipSize = null;
  orientation = 'horizontal';
  setCellClickHandler(handlePlacementClick);
  render();
  updateStatus('Select a ship below, then click a cell to place it.');
}

function render() {
  renderGameBoards(humanPlayer, computerPlayer, phase);
  renderControls(phase, SHIP_SIZES, orientation, selectShip, toggleOrientation, handleRestart, humanPlayer.board.ships);
}

function selectShip(size) {
  selectedShipSize = size;
  updateStatus(`Placing ${SHIP_NAMES[size]} (size ${size}) — click a cell on your board.`);
}

function handlePlacementClick(row, col) {
  if (phase !== 'placement' || !selectedShipSize) return;

  const ship = new Ship(selectedShipSize);
  const placed = humanPlayer.board.placeShip(ship, row, col, orientation);

  if (!placed) {
    updateStatus('Cannot place there — try another cell.');
    return;
  }

  selectedShipSize = null;

  if (humanPlayer.board.ships.length >= 5) {
    phase = 'battle';
    computerPlayer.placeShipsRandomly();
    setCellClickHandler(handleBattleClick);
    render();
    updateStatus('All ships placed! Click enemy waters to attack.');
  } else {
    render();
    updateStatus('Select another ship below, then click a cell.');
  }
}

function handleBattleClick(row, col) {
  if (phase !== 'battle' || isProcessing) return;

  const result = computerPlayer.board.receiveAttack(row, col);
  if (result === 'duplicate') return;

  isProcessing = true;
  render();
  updateStatus(result === 'hit' ? 'Hit!' : 'Miss!');

  if (computerPlayer.board.allShipsSunk()) {
    phase = 'gameover';
    isProcessing = false;
    render();
    updateStatus('Victory! You sank the entire enemy fleet!');
    return;
  }

  setTimeout(() => {
    try {
      const [cr, cc] = computerPlayer.getCoordinates();
      const compResult = humanPlayer.board.receiveAttack(cr, cc);

      render();
      if (compResult === 'hit') {
        updateStatus('Computer hit your ship!');
      } else {
        updateStatus('Computer missed.');
      }

      if (humanPlayer.board.allShipsSunk()) {
        phase = 'gameover';
        render();
        updateStatus('Defeat! The computer sank your fleet.');
        return;
      }

      updateStatus('Your turn — click enemy waters.');
    } finally {
      isProcessing = false;
    }
  }, 800);
}

function toggleOrientation() {
  orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  render();
}

function handleRestart() {
  if (phase === 'placement') {
    initGame();
    humanPlayer.placeShipsRandomly();
    computerPlayer.placeShipsRandomly();
    phase = 'battle';
    setCellClickHandler(handleBattleClick);
    render();
    updateStatus('Ships auto-placed! Click enemy waters to attack.');
  } else {
    initGame();
  }
}

initGame();
