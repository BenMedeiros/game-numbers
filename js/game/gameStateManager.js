'use strict';

import gameData from "./gameData.js";
import gameConfig from "./gameConfig.js";

export function evalGameComplete() {
    let userWin = true;

    for (let i = 0; i < gameConfig.gameIdPartitioned.length; i++) {
        if (gameConfig.gameIdPartitioned[i] !== gameData.stateClick1[i]) userWin = false;
    }

    if (userWin) {
        console.log('YOU WIN');
        document.dispatchEvent(new CustomEvent('game-won', {detail: {gameData, gameConfig}}));
    }

}

//saves what state the user is dragging thru multiple tiles
let initialDragTileState = null;

export function getInitialDraggedState() {
    return initialDragTileState;
}

export function setInitialDraggedState(state) {
    initialDragTileState = state;
}

export function updateTileStateAndElementDrag(tile, el, clickTo) {
    if (getInitialDraggedState() === 'unclicked') {
        if (clickTo === 'click1') {
            updateTileStateAndElementToClick1(tile, el);
        } else {
            updateTileStateAndElementToClick2(tile, el);
        }
    } else {
        updateTileStateAndElementToUnclicked(tile, el);
    }
}

export function updateTileStateAndElementToClick1(tile, el) {
    tile.state = 'click1';
    el.classList.add('click1');
    el.classList.remove('click2');
    evalGameComplete();
}

export function updateTileStateAndElementToClick2(tile, el) {
    tile.state = 'click2';
    el.classList.remove('click1');
    el.classList.add('click2');
    evalGameComplete();
}

export function updateTileStateAndElementToUnclicked(tile, el) {
    tile.state = 'unclicked';
    el.classList.remove('click1');
    el.classList.remove('click2');
    evalGameComplete();
}

export function updateTileState(tile, state) {
    const el = document.getElementById(tile.elId);
    console.log('update', tile, state );

    if (state === 'unclicked') {
        updateTileStateAndElementToUnclicked(tile, el);
    } else if (state === 'click1') {
        updateTileStateAndElementToClick1(tile, el);
    } else if (state === 'click2') {
        updateTileStateAndElementToClick2(tile, el);
    } else {
        throw new Error('bad state');
    }
}