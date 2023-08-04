'use strict';

import newGame from "./game/newGame.js";
import io from "./services/io.js";
import gameBoardElements from "./ui/gameboardElements.js";
import gameStateManager from "./game/gameStateManager.js";
import settingsController from "../settingsComponent/settingsController.js";
import winScreen from "./ui/winScreen.js";

export default {
    getGameData: () => gameData
}

const gameConfig = {
    numCols: 4,
    numRows: 5
};

const gameData = {
    gameboardElement: null,
    tiles: [],
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
    gameConfigHandler.readUiSettingsIntoConfig();
    gameConfigHandler.saveConfigToStorage();
    newGame.clearTiles(gameData.tiles);
    newGame.clearTiles(gameData.headerTiles);

    gameBoardElements.newGameBoardElement(gameConfig, gameData);

    newGame.createTiles(gameData.tiles, gameConfig);
    newGame.createHeaderTiles(gameData.headerTiles, gameConfig);
    newGame.calculateHeaderTileText(gameConfig, gameData.tiles, gameData.headerTiles);

    gameBoardElements.drawTileElements(gameData.gameboardElement, gameData);
    gameStateManager.listenForGameComplete(gameData);

    gameData.startTime = new Date();

    gameData.intervalId = setInterval(() => {
        gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    }, 100);

    document.addEventListener('game-won', saveAndLogTime, {once: true});

}

function saveAndLogTime() {
    gameData.endTime = new Date();
    gameData.timeElapsed = (gameData.endTime - gameData.startTime) / 1000;
    console.log(gameData.startTime, gameData.endTime, gameData.timeElapsed);
    clearInterval(gameData.intervalId);
}

document.addEventListener('new-game', () => {
    clearInterval(gameData.intervalId);
    document.removeEventListener('game-won', saveAndLogTime, {once: true});
    updateBoard();
});


// start
setTimeout(updateBoard, 500);
