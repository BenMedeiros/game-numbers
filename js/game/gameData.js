'use strict';

import gameConfig from "./gameConfig.js";

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

export default gameData;