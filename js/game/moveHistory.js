'use strict';

import {updateTileState} from "./gameStateManager.js";
import gameData from "./gameData.js";
import {
    branchCreated,
    branchDeleted, branchNotAllowed,
    moveHistoryEmpty,
    moveMade,
    triggerFunctionEvent
} from "../common/eventHandler.js";

const moveHistory = [];

function getCurrentBranchIndex() {
    return moveHistory.length - 1;
}

function getCurrentBranch() {
    return moveHistory[moveHistory.length - 1];
}

function getCurrentMoveIndex() {
    return getCurrentBranch().length - 1;
}

export function startLogMoveHistory() {
    // [startTime[branch]]
    moveHistory.length = 0;
    moveHistory.push([]);
}

//save the move by storing the current click1/click2 states
export function saveMoveHistory(tile, newState) {
    getCurrentBranch().push({tileId: tile.id, oldState: tile.state, newState});
    moveMade(getCurrentBranchIndex(), getCurrentMoveIndex());
}

export function createBranch() {
    //    branch doesn't have any moves so its unneeded
    if (getCurrentMoveIndex() === -1) return false;
    moveHistory.push([]);
    branchCreated(getCurrentBranchIndex());
}

// returns true when a move undone but still on same branch
export function undoLastMove() {
    const oldBranchIndex = getCurrentBranchIndex();
    const oldMoveIndex = getCurrentMoveIndex();

    if (getCurrentBranchIndex() === -1 && getCurrentMoveIndex() === -1) {
        moveHistoryEmpty();
        return;
    }else if(getCurrentMoveIndex() === -1){
    //    branch is empty, not a real undo, so recall self
        moveHistory.pop();
        branchDeleted(oldBranchIndex);
        // undoLastMove();
        return;
    }

    const lastMove = getCurrentBranch()[getCurrentMoveIndex()];
    updateTileState(gameData.tiles[lastMove.tileId], lastMove.oldState);
    // setting the state creates a record for the undo, so remove 2
    getCurrentBranch().pop();
    getCurrentBranch().pop();

    if (getCurrentMoveIndex() === -1) {
        //no moves left in branch === -1
        if (getCurrentBranchIndex() > 0) {
            //main branch 0 /can't be deleted
            moveHistory.pop();
            branchDeleted(oldBranchIndex);
        }

        if (getCurrentBranchIndex() === 0 && getCurrentMoveIndex() === -1) {
            moveHistoryEmpty();
        }
    }
}

//branches stores when a user saves a checkpoint in move history
export function restoreBranch(branchIndex) {
    if (branchIndex <= 0) throw new Error('Branch 0 is start of game.');

    while (getCurrentBranchIndex() >= branchIndex) {
        console.log('loop-1', getCurrentBranchIndex(), branchIndex);
        undoLastMove();
        console.log('loop-2', getCurrentBranchIndex(), branchIndex);
    }
}