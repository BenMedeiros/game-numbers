'use strict';

import {createHeaderTiles, calculateHeaderTileText} from "./game/headerTiles.js";
import {createTiles, clearTiles} from "./game/tiles.js";
import io from "./services/io.js";
import {drawTileElements, newGameBoardElement} from "./ui/gameboardElements.js";
import gameStateManager from "./game/gameStateManager.js";
import settingsController from "../settingsComponent/settingsController.js";
import winScreen from "./ui/winScreen.js";
import {randomInt} from "./common/utils.js";
import {saveCompletedGame} from "./game/gameHistory.js";

const gameConfig = {
    numCols: 4,
    numRows: 5,
    gameId: 0
};

const gameData = {
    gameboardElement: null,
    tiles: [],
    stateClick1: 0,
    stateClick2: 0,
    headerTiles: [],
    startTime: new Date(),
    timeElapsed: 0,
    intervalId: null
};


function updateBoard() {
    clearTiles(gameData.tiles);
    clearTiles(gameData.headerTiles);

    newGameBoardElement(gameConfig, gameData);

    createTiles(gameData.tiles, gameConfig, gameData);
    createHeaderTiles(gameData.headerTiles, gameConfig);
    calculateHeaderTileText(gameConfig, gameData.tiles, gameData.headerTiles);

    drawTileElements(gameData.gameboardElement, gameData);
    gameStateManager.listenForGameComplete(gameData);


    document.addEventListener('game-won', saveAndLogTime, {once: true});


    const mainTags = document.getElementsByTagName("main");
    if (mainTags.length !== 1) throw new Error('should only be 1 main tag in body');
    const mainTag = mainTags[0];

    if (gameConfig.gameId > 1 << 30) console.warn('Single int limit exceeded');
    console.log(gameConfig.gameId);

}

function saveAndLogTime() {
    gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    console.log(gameConfig.gameId, gameData.startTime, gameData.timeElapsed);

    saveCompletedGame(gameConfig, gameData);

    gameConfig.gameId = randomInt(0, 1 << 30);
    gameConfigHandler.populateUiSettingsFromConfig();
    clearInterval(gameData.intervalId);
}

document.addEventListener('new-game', () => {
    console.log('new-game');

    gameData.startTime = new Date();
    gameData.stateClick1 = 0;
    gameData.stateClick2 = 0;

    clearInterval(gameData.intervalId);
    gameData.intervalId = setInterval(() => {
        gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    }, 51);

    document.removeEventListener('game-won', saveAndLogTime, {once: true});

    gameConfigHandler.readUiSettingsIntoConfig();
    gameConfigHandler.saveConfigToStorage();

    updateBoard();
});

const gameConfigHandler = io.bindConfigToStorage('gameConfig', gameConfig);
gameConfigHandler.loadConfigFromStorage();
gameConfigHandler.populateUiSettingsFromConfig();


// start
setTimeout(updateBoard, 500);

export default {
    getGameData: () => gameData
}
