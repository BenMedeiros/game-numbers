'use strict';

import {updateTileState} from "./gameStateManager.js";
import gameData from "./gameData.js";

const moveHistoryMap = {};

export function startLogHistory(){
    moveHistoryMap[gameData.startTime] = [];
}

//save the move by storing the current click1/click2 states
export function saveMoveHistory(tile, newState, gameData) {
    moveHistoryMap[gameData.startTime].push([tile.id, tile.state, newState]);
    triggerEvent(gameData);
}

export function undoLastMove(gameData) {
    if (moveHistoryMap[gameData.startTime].length === 0) return;

    const lastMove = moveHistoryMap[gameData.startTime][moveHistoryMap[gameData.startTime].length - 1];
    console.log('UNDO MOVE', lastMove);
    updateTileState(gameData.tiles[lastMove[0]], lastMove[1]);
    // setting the state creates a record for the undo, so remove 2
    moveHistoryMap[gameData.startTime].pop();
    moveHistoryMap[gameData.startTime].pop();

    triggerEvent(gameData);
}

function triggerEvent(gameData) {
    if (moveHistoryMap[gameData.startTime].length === 0) {
        gameData.gameboardElement.dispatchEvent(new Event('move-history-empty'));
    } else {
        gameData.gameboardElement.dispatchEvent(new Event('move-history-notempty'));
    }
}

//stores the index of move history to go back to
const branches = [];

export function createBranch() {
    console.log('branch craeted');
    const branchIndex = branches.push(moveHistoryMap[gameData.startTime].length - 1) - 1;
    return branchIndex;
}