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
    gameId: '',
    //gameId is a int[] so that any number of tiles can be supported
    gameIdPartitioned: []
};

Object.defineProperties(gameConfig, {
    gameId: {
        get() {
            return this.gameIdPartitioned.join('-');
        },
        set(gameId) {
            this.gameIdPartitioned.length = 0;
            //each byte/int supports 30 tiles, so remove gameId excess since it'll never be used
            const lengthRequired = Math.ceil(this.numCols * this.numRows / 30);
            const maxLengthInLastPartition = ((this.numCols * this.numRows) - 1) % 30;

            const strArray = String(gameId).split('-');
            for (const str of strArray) {
                //10 char numbers is roughly what int32 can hold
                for (let i = 0; i < str.length; i += 10) {
                    this.gameIdPartitioned.push(parseInt(str.substr(i, i + 10)));
                }
            }

            //if this is more than needed to describe the square, truncate
            if (this.gameIdPartitioned.length > lengthRequired) {
                this.gameIdPartitioned.length = lengthRequired;
            }
            //only need this many tiles/bits in the last partition
            this.gameIdPartitioned[this.gameIdPartitioned.length - 1] %= (1 << maxLengthInLastPartition);

            console.log(lengthRequired, this.gameIdPartitioned, maxLengthInLastPartition, 1 << maxLengthInLastPartition);
        }
    }
});

console.log(gameConfig);

const gameData = {
    gameboardElement: null,
    tiles: [],
    //states are also int[] since they are binary holders like gameId
    stateClick1: new Array(gameConfig.gameIdPartitioned.length).fill(0),
    stateClick2: new Array(gameConfig.gameIdPartitioned.length).fill(0),
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
    gameStateManager.listenForGameComplete(gameData, gameConfig);

    document.addEventListener('game-won', saveAndLogTime, {once: true});
}

function saveAndLogTime() {
    gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    console.log(gameConfig.gameId, gameData.startTime, gameData.timeElapsed);

    saveCompletedGame(gameConfig, gameData);

    clearInterval(gameData.intervalId);
}

document.addEventListener('new-game', () => {
    console.log('new-game');

    gameConfigHandler.readUiSettingsIntoConfig();

    gameConfig.gameId = randomInt(0, 1 << 30) + '-' + randomInt(0, 1 << 30);
    gameConfigHandler.populateUiSettingsFromConfig();
    gameConfigHandler.saveConfigToStorage();

    gameData.startTime = new Date();
    gameData.stateClick1 = new Array(gameConfig.gameIdPartitioned.length).fill(0);
    gameData.stateClick2 = new Array(gameConfig.gameIdPartitioned.length).fill(0);

    clearInterval(gameData.intervalId);
    gameData.intervalId = setInterval(() => {
        gameData.timeElapsed = (new Date() - gameData.startTime) / 1000;
    }, 51);

    document.removeEventListener('game-won', saveAndLogTime, {once: true});


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
