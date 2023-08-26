'use strict';

import {createHeaderTiles, calculateHeaderTileChains} from "./game/headerTiles.js";
import {createTiles, clearTiles} from "./game/tiles.js";
import {drawTileElements, newGameBoardElement} from "./ui/gameboardElements.js";
import {populateSettingsElementFromConfig, updateConfigFromUiElement} from "./ui/settingsController.js";
import {randomInt} from "./common/utils.js";
import {saveCompletedGame} from "./game/gameHistory.js";
import gameConfig from "./game/gameConfig.js";
import gameData from "./game/gameData.js";
import {createTimerElement} from "./ui/timerElement.js";
import {createControlsScreen} from "./ui/controlsScreen.js";
import {startLogMoveHistory} from "./game/moveHistory.js";
import {resetSolver} from "./game/gameSolver.js";
import {collapseHelpScreen, createHelpScreen} from "./ui/helpScreen.js";
//just to run it
import winScreen from "./ui/winScreen.js";

function buildShareUrl() {
    window.history.replaceState(null, null, '?'
        + 'timeElapsed=' + gameData.timeElapsed
        + '&numRows=' + gameConfig.numRows
        + '&numCols=' + gameConfig.numCols
        + '&gameId=' + gameConfig.gameId
    );

}

//url in event of a challenge sent
let urlParams = new URL(window.location.toLocaleString()).searchParams;

function updateNewGameConfig() {
    //if all the config is here use the settings, if it's not already been completed
    if (urlParams.has('gameId') && urlParams.has('numCols')
        && urlParams.has('numRows') && urlParams.has('timeElapsed')) {
        gameConfig.numCols = Number(urlParams.get('numCols'));
        gameConfig.numRows = Number(urlParams.get('numRows'));
        gameConfig.gameId = urlParams.get('gameId');
        gameData.timeToBeat = urlParams.get('timeElapsed');
        urlParams.forEach((value, key) => urlParams.delete(key));

        populateSettingsElementFromConfig(['numCols', 'numRows']);
        window.history.replaceState(null, null, '?challenge=true');

    } else {
        updateConfigFromUiElement(['numCols', 'numRows', 'tileSize', 'autoNewGame']);
        gameConfig.gameId = randomInt(0, 1 << 30) + '-' + randomInt(0, 1 << 30);
        gameData.timeToBeat = null;
        //remove URL when new game. it gets populated on win
        window.history.replaceState(null, null, '?');
    }

    populateSettingsElementFromConfig(['gameId']);
    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
}

function updateBoard() {
    updateNewGameConfig();

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

    resetSolver();
}

function saveAndLogTime() {
    gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    console.log(gameConfig.gameId, gameData.startTime, gameData.timeElapsed);

    saveCompletedGame(gameConfig, gameData);

    buildShareUrl();

    clearInterval(gameData.intervalId);
}


populateSettingsElementFromConfig(['numCols', 'numRows', 'tileSize', 'autoNewGame']);
document.addEventListener('new-game', updateBoard);

createHelpScreen();
if (gameConfig.newPlayer === true) {
    gameConfig.newPlayer = false;
} else {
    collapseHelpScreen();
}


//start game automatically
setTimeout(updateBoard, 500);

export default {
    getGameData: () => gameData
}

