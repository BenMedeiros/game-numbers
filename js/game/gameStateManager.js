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
let initialDragTileState = 0;

export function getInitialDraggedState() {
    return initialDragTileState;
}

export function setInitialDraggedState(state) {
    initialDragTileState = state;
}

export function updateTileStateAndElement(tile, el, clickTo) {
    if (getInitialDraggedState() === 'unclicked') {
        tile.state = clickTo;
        if (clickTo === 'click1') {
            el.classList.add('click1');
            el.classList.remove('click2');
        } else {
            el.classList.add('click2');
            el.classList.remove('click1');
        }
    } else {
        tile.state = 'unclicked';
        el.classList.remove('click1');
        el.classList.remove('click2');
    }
    evalGameComplete();
}