'use strict';

import {createHeaderTiles, calculateHeaderTileText} from "./game/headerTiles.js";
import {createTiles, clearTiles} from "./game/tiles.js";
import io from "./services/io.js";
import {drawTileElements, newGameBoardElement} from "./ui/gameboardElements.js";
import gameStateManager from "./game/gameStateManager.js";
import settingsController from "../settingsComponent/settingsController.js";
import winScreen from "./ui/winScreen.js";
import {randomInt} from "./common/utils.js";

const gameConfig = {
    numCols: 4,
    numRows: 5,
    gameId: 0
};

const gameData = {
    gameboardElement: null,
    tiles: [],
    stateClick1: 10,
    stateClick2: 0,
    headerTiles: [],
    startTime: new Date(),
    endTime: null,
    timeElapsed: 0,
    intervalId: null
};

const gameConfigHandler = io.bindConfigToStorage('gameConfig', gameConfig);
gameConfigHandler.loadConfigFromStorage();
gameConfigHandler.populateUiSettingsFromConfig();

function updateBoard() {
    clearTiles(gameData.tiles);
    clearTiles(gameData.headerTiles);

    newGameBoardElement(gameConfig, gameData);

    createTiles(gameData.tiles, gameConfig, gameData);
    createHeaderTiles(gameData.headerTiles, gameConfig);
    calculateHeaderTileText(gameConfig, gameData.tiles, gameData.headerTiles);

    drawTileElements(gameData.gameboardElement, gameData);
    gameStateManager.listenForGameComplete(gameData);

    gameData.startTime = new Date();

    gameData.intervalId = setInterval(() => {
        gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    }, 100);

    document.addEventListener('game-won', saveAndLogTime, {once: true});


    const mainTags = document.getElementsByTagName("main");
    if (mainTags.length !== 1) throw new Error('should only be 1 main tag in body');
    const mainTag = mainTags[0];

    if (gameConfig.gameId > 1 << 30) console.warn('Single int limit exceeded');
    console.log(gameConfig.gameId);

}

function saveAndLogTime() {
    gameData.endTime = new Date();
    gameData.timeElapsed = (gameData.endTime - gameData.startTime) / 1000;
    console.log(gameConfig.gameId, gameData.startTime, gameData.endTime, gameData.timeElapsed);
    gameConfig.gameId = randomInt(0, 1 << 30);
    gameConfigHandler.populateUiSettingsFromConfig();
    clearInterval(gameData.intervalId);
}

document.addEventListener('new-game', () => {
    console.log('new-game');
    clearInterval(gameData.intervalId);
    document.removeEventListener('game-won', saveAndLogTime, {once: true});

    gameConfigHandler.readUiSettingsIntoConfig();
    gameConfigHandler.saveConfigToStorage();

    updateBoard();
});


// start
setTimeout(updateBoard, 500);

export default {
    getGameData: () => gameData
}
