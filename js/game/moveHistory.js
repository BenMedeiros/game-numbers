'use strict';

import {updateTileState} from "./gameStateManager.js";

const moveHistoryMap = {};
//save the move by storing the current click1/click2 states
export function saveMoveHistory(tile, newState, gameData) {
    if (moveHistoryMap[gameData.startTime] === undefined) moveHistoryMap[gameData.startTime] = [];
    moveHistoryMap[gameData.startTime].push([tile.id, tile.state, newState]);
    console.log(moveHistoryMap[gameData.startTime]);
}

export function undoLastMove(gameData) {
    if (!moveHistoryMap[gameData.startTime] || moveHistoryMap[gameData.startTime].length === 0) return;

    const lastMove = moveHistoryMap[gameData.startTime][moveHistoryMap[gameData.startTime].length - 1];
    console.log('UNDO MOVE', lastMove);
    updateTileState(gameData.tiles[lastMove[0]], lastMove[1]);
    // setting the state creates a record for the undo, so remove 2
    moveHistoryMap[gameData.startTime].pop();
    moveHistoryMap[gameData.startTime].pop();
}
