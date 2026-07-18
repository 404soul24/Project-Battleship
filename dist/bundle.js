/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Gameboard.js"
/*!*************************************!*\
  !*** ./src/components/Gameboard.js ***!
  \*************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Gameboard: () => (/* binding */ Gameboard)\n/* harmony export */ });\nclass Gameboard {\r\n  constructor() {\r\n    this.grid = Array.from({ length: 10 }, () =>\r\n      Array.from({ length: 10 }, () => null),\r\n    );\r\n    this.missedAttack = [];\r\n    this.ships = [];\r\n  }\r\n  placeShip(ship, row, col, isHorizontal) {\r\n    for (let i = 0; i < ship.length; i++) {\r\n      if (isHorizontal === true) {\r\n        this.grid[row][col + i] = ship;\r\n      } else {\r\n        this.grid[row + i][col] = ship;\r\n      }\r\n    }\r\n    this.ships.push(ship);\r\n  }\r\n  receiveAttack(row, col) {\r\n    const targetCell = this.grid[row][col];\r\n    if (targetCell !== null) {\r\n      targetCell.hit();\r\n    } else {\r\n      this.missedAttack.push([row, col]);\r\n    }\r\n  }\r\n  allShipsSunk() {\r\n     return this.ships.every((ship) => ship.isSunk());\r\n  }\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://battleship/./src/components/Gameboard.js?\n}");

/***/ },

/***/ "./src/components/Player.js"
/*!**********************************!*\
  !*** ./src/components/Player.js ***!
  \**********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Player: () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _components_Gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Gameboard.js */ \"./src/components/Gameboard.js\");\n\r\nclass Player{\r\n    constructor(name){\r\n        this.name = name;\r\n        this.board = new _components_Gameboard_js__WEBPACK_IMPORTED_MODULE_0__.Gameboard();\r\n        this.pastMoves = [];\r\n    }\r\n    getCoordinates(){\r\n        let row, col, moveKey;\r\n\r\n        do {\r\n            row = Math.floor(Math.random() * 10);\r\n            col = Math.floor(Math.random() * 10);\r\n            moveKey = `${row},${col}`;\r\n        } while (this.pastMoves.includes(moveKey));\r\n\r\n        this.pastMoves.push(moveKey);\r\n        return [row, col];\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://battleship/./src/components/Player.js?\n}");

/***/ },

/***/ "./src/components/Ship.js"
/*!********************************!*\
  !*** ./src/components/Ship.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Ship: () => (/* binding */ Ship)\n/* harmony export */ });\nclass Ship{\r\n    constructor(length){\r\n        this.length = length;\r\n        this.hits = 0;\r\n    }\r\n    hit(){\r\n        this.hits++;\r\n    }\r\n    isSunk(){\r\n        if(this.length === this.hits){\r\n            return true;\r\n        }\r\n        return false;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://battleship/./src/components/Ship.js?\n}");

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_Player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Player.js */ \"./src/components/Player.js\");\n/* harmony import */ var _components_Ship_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Ship.js */ \"./src/components/Ship.js\");\n\r\n\r\n\r\nconst humanPlayer = new _components_Player_js__WEBPACK_IMPORTED_MODULE_0__.Player(\"Player 1\");\r\nconst computerPlayer = new _components_Player_js__WEBPACK_IMPORTED_MODULE_0__.Player(\"Computer AI\");\r\n\r\nhumanPlayer.board.placeShip(new _components_Ship_js__WEBPACK_IMPORTED_MODULE_1__.Ship(3), 2, 3, true);\r\ncomputerPlayer.board.placeShip(new _components_Ship_js__WEBPACK_IMPORTED_MODULE_1__.Ship(3), 5, 1, false);\r\n\r\nconst humanGridElement = document.getElementById('human-grid');\r\nconst computerGridElement = document.getElementById('computer-grid');\r\n\r\nfunction handleTurn(targetRow, targetCol) {\r\n    computerPlayer.board.receiveAttack(targetRow, targetCol);\r\n    \r\n    if (computerPlayer.board.allShipsSunk()) {\r\n        alert(\"Victory! You destroyed the enemy fleet!\");\r\n        renderGameBoards();\r\n        return;\r\n    }\r\n\r\n    const [compRow, compCol] = computerPlayer.getCoordinates();\r\n    humanPlayer.board.receiveAttack(compRow, compCol);\r\n\r\n    if (humanPlayer.board.allShipsSunk()) {\r\n        alert(\"Defeat! The computer destroyed your fleet.\");\r\n        renderGameBoards();\r\n        return;\r\n    }\r\n\r\n    renderGameBoards();\r\n}\r\n\r\nfunction renderGameBoards() {\r\n    humanGridElement.innerHTML = '';\r\n    computerGridElement.innerHTML = '';\r\n\r\n    renderGrid(humanPlayer, humanGridElement, false);\r\n    \r\n    renderGrid(computerPlayer, computerGridElement, true);\r\n}\r\n\r\nfunction renderGrid(player, containerElement, isEnemyGrid) {\r\n    player.board.grid.forEach((row, rowIndex) => {\r\n        row.forEach((cell, colIndex) => {\r\n            const cellButton = document.createElement('button');\r\n            cellButton.classList.add('cell'); \r\n\r\n            const isMiss = player.board.missedAttack.some(([r, c]) => r === rowIndex && c === colIndex);\r\n            const isHit = cell !== null && !isMiss && player.board.grid[rowIndex][colIndex] === cell; \r\n\r\n            if (isMiss) {\r\n                cellButton.classList.add('miss');\r\n            } else if (cell !== null && isEnemyGrid === false) {\r\n                cellButton.classList.add('ship');\r\n            }\r\n\r\n            if (isEnemyGrid && !isMiss) {\r\n                cellButton.addEventListener('click', () => {\r\n                    handleTurn(rowIndex, colIndex);\r\n                });\r\n            } else if (isEnemyGrid) {\r\n                cellButton.disabled = true;\r\n            }\r\n\r\n            containerElement.appendChild(cellButton);\r\n        });\r\n    });\r\n}\r\n\r\n// Kickstart the game on page load\r\nrenderGameBoards();\n\n//# sourceURL=webpack://battleship/./src/index.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	let __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;