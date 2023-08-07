'use strict';

import {updateTileState} from "./gameStateManager.js";
import gameData from "./gameData.js";

const moveHistoryMap = {};

function getCurrentGameHistory() {
    return moveHistoryMap[gameData.startTime];
}

export function getCurrentGameHistoryIndex() {
    return moveHistoryMap[gameData.startTime].length - 1;
}

function getCurrentBranch() {
    return getCurrentGameHistory()[getCurrentGameHistoryIndex()];
}

export function startLogMoveHistory() {
    // [startTime[branch]]
    moveHistoryMap[gameData.startTime] = [];
    getCurrentGameHistory().push([]);
    triggerEvent();
}

//save the move by storing the current click1/click2 states
export function saveMoveHistory(tile, newState) {
    getCurrentBranch().push([tile.id, tile.state, newState]);
    triggerEvent(gameData);
}

// returns true when a move undone, else false
export function undoLastMove() {
    if (getCurrentBranch().length === 0) return false;

    const lastMove = getCurrentBranch()[getCurrentBranch().length - 1];
    updateTileState(gameData.tiles[lastMove[0]], lastMove[1]);
    // setting the state creates a record for the undo, so remove 2
    getCurrentBranch().pop();
    getCurrentBranch().pop();

    triggerEvent(gameData);
    return true;
}

function triggerEvent() {
    if (getCurrentGameHistoryIndex() === 0 && getCurrentBranch().length === 0) {
        gameData.gameboardElement.dispatchEvent(new Event('move-history-empty'));
    } else {
        gameData.gameboardElement.dispatchEvent(new Event('move-history-not-empty'));
    }

    if (getCurrentBranch().length === 0) {
        gameData.gameboardElement.dispatchEvent(new Event('branch-history-empty'));
    } else {
        gameData.gameboardElement.dispatchEvent(new Event('branch-history-not-empty'));
    }
}

export function createBranch() {
    if (getCurrentBranch().length === 0) {
        //    branch doesn't have any moves so its unneeded
        return;
    }

    const branchIndex = getCurrentGameHistory().push([]) - 1;
    triggerEvent();
    return branchIndex;
}

//branches stores when a user saves a checkpoint in move history
export function restoreBranch(branchIndex) {
    let safety = 0;
    while (getCurrentGameHistoryIndex() >= branchIndex) {
        while (undoLastMove()) {
            // intentionally blank
        }

        getCurrentGameHistory().pop();
        if (safety++ > 4) break;
    }
}