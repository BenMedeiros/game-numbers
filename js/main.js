'use strict';

import {createHeaderTiles, calculateHeaderTileChains} from "./game/headerTiles.js";
import {createTiles, clearTiles} from "./game/tiles.js";
import {drawTileElements, newGameBoardElement} from "./ui/gameboardElements.js";
import {
    populateSettingsElementFromConfig,
    updateConfigFromUiElement
} from "../components/settingsComponent/settingsController.js";
import winScreen from "./ui/winScreen.js";
import {randomInt} from "./common/utils.js";
import {saveCompletedGame} from "./game/gameHistory.js";
import gameConfig from "./game/gameConfig.js";
import gameData from "./game/gameData.js";
import {createTimerElement} from "./ui/timerElement.js";
import {createControlsScreen} from "./ui/controlsScreen.js";
import {startLogMoveHistory} from "./game/moveHistory.js";

function updateBoard() {
    console.log('new-game');

    updateConfigFromUiElement(gameConfig, ['numCols', 'numRows', 'tileSize']);
    gameConfig.gameId = randomInt(0, 1 << 30) + '-' + randomInt(0, 1 << 30);
    populateSettingsElementFromConfig(gameConfig, ['gameId']);
    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));

    gameData.startTime = new Date();
    gameData.stateClick1 = new Array(gameConfig.gameIdPartitioned.length).fill(0);
    gameData.stateClick2 = new Array(gameConfig.gameIdPartitioned.length).fill(0);

    clearInterval(gameData.intervalId);
    gameData.intervalId = setInterval(() => {
        gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    }, 51);

    document.removeEventListener('game-won', saveAndLogTime, {once: true});

    clearTiles(gameData.tiles);
    clearTiles(gameData.headerTiles);

    newGameBoardElement(gameConfig, gameData);
    createTimerElement(gameData);
    createControlsScreen();

    createTiles(gameData.tiles, gameConfig, gameData);
    createHeaderTiles();
    calculateHeaderTileChains();

    drawTileElements(gameData.gameboardElement, gameData);

    document.addEventListener('game-won', saveAndLogTime, {once: true});

    startLogMoveHistory();

}

function saveAndLogTime() {
    gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    console.log(gameConfig.gameId, gameData.startTime, gameData.timeElapsed);

    saveCompletedGame(gameConfig, gameData);

    clearInterval(gameData.intervalId);
}

populateSettingsElementFromConfig(gameConfig, ['numCols', 'numRows', 'tileSize']);
document.addEventListener('new-game', updateBoard);

// automatically start next game
document.addEventListener('game-won', () => {
    setTimeout(() => {
        document.dispatchEvent(new Event('new-game'));
    }, 500);
});


export default {
    getGameData: () => gameData
}

