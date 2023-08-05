'use strict';

import TILE_STATES from "./tile_states.js";
import {updateTileElementState} from "../ui/gameboardElements.js";

export default {
    tileClicked1,
    tileClicked2,
    listenForGameComplete
}

function evalGameComplete(gameData, gameConfig){
    let userWin = true;
    // for (const tile of gameData.tiles) {
    //     if(tile.isFilled){
    //         //    tile is filled and user is wrong
    //         if(tile.state !== TILE_STATES.CLICK1) {
    //             userWin = false;
    //             break;
    //         }
    //     }else{
    //         //tile is not filled and user is wrong
    //         if(tile.state === TILE_STATES.CLICK1){
    //             userWin = false;
    //             break;
    //         }
    //     }
    // }

    for (let i = 0; i < gameConfig.gameIdPartitioned.length; i++) {
        if(gameConfig.gameIdPartitioned[i] !== gameData.stateClick1[i]) userWin = false;
    }

    if(userWin) {
        console.log('YOU WIN');
        document.dispatchEvent(new CustomEvent('game-won', { detail: { gameData, gameConfig } }));
    }

}

function tileClicked1(tile){
    const el = document.getElementById(tile.elId);

    if (tile.state === TILE_STATES.UNCLICKED) {
        tile.state = TILE_STATES.CLICK1;
    } else if (tile.state === TILE_STATES.CLICK1) {
        tile.state = TILE_STATES.UNCLICKED;
    } else if (tile.state === TILE_STATES.CLICK2) {
        tile.state = TILE_STATES.UNCLICKED;
    } else {
        throw new Error('Impossible');
    }

    updateTileElementState(tile, el);
}

function tileClicked2(tile){
    const el = document.getElementById(tile.elId);

    if (tile.state === TILE_STATES.UNCLICKED) {
        tile.state = TILE_STATES.CLICK2;
    } else if (tile.state === TILE_STATES.CLICK1) {
        tile.state = TILE_STATES.UNCLICKED;
    } else if (tile.state === TILE_STATES.CLICK2) {
        tile.state = TILE_STATES.UNCLICKED;
    } else {
        throw new Error('Impossible');
    }

    updateTileElementState(tile, el);
}

function listenForGameComplete(gameData, gameConfig){
     gameData.gameboardElement.addEventListener('tile-clicked-1', e => {
        tileClicked1(e.detail.tile);
        evalGameComplete(gameData, gameConfig);
    });
    gameData.gameboardElement.addEventListener('tile-clicked-2', e => {
        tileClicked2(e.detail.tile);
        evalGameComplete(gameData, gameConfig);
    });
}
