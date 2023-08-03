'use strict';

import TILE_STATES from "./tile_states.js";

export default {
    tileClicked1,
    tileClicked2,
    listenForGameComplete
}

function evalGameComplete(gameData){
    let userWin = true;
    for (const tile of gameData.tiles) {
        if(tile.isFilled){
            //    tile is filled and user is wrong
            if(tile.state !== TILE_STATES.CLICK1) {
                userWin = false;
                break;
            }
        }else{
            //tile is not filled and user is wrong
            if(tile.state === TILE_STATES.CLICK1){
                userWin = false;
                break;
            }
        }
    }

    if(userWin) {
        console.log('YOU WIN');
        document.dispatchEvent(new CustomEvent('game-won', { detail: {  } }));
    }

}

function tileClicked1(tile){
    const el = document.getElementById(tile.id);

    if (tile.state === TILE_STATES.UNCLICKED) {
        el.classList.add('click1');
        tile.state = TILE_STATES.CLICK1;
    } else if (tile.state === TILE_STATES.CLICK1) {
        el.classList.remove('click1');
        tile.state = TILE_STATES.UNCLICKED;
    } else if (tile.state === TILE_STATES.CLICK2) {
        el.classList.remove('click2');
        tile.state = TILE_STATES.UNCLICKED;
    } else {
        throw new Error('Impossible');
    }
}

function tileClicked2(tile){
    const el = document.getElementById(tile.id);

    if (tile.state === TILE_STATES.UNCLICKED) {
        el.classList.add('click2');
        tile.state = TILE_STATES.CLICK2;
    } else if (tile.state === TILE_STATES.CLICK1) {
        el.classList.remove('click1');
        tile.state = TILE_STATES.UNCLICKED;
    } else if (tile.state === TILE_STATES.CLICK2) {
        el.classList.remove('click2');
        tile.state = TILE_STATES.UNCLICKED;
    } else {
        throw new Error('Impossible');
    }
}

function listenForGameComplete(gameData){
    console.log('listeners active');
     gameData.gameboardElement.addEventListener('tile-clicked-1', e => {
        tileClicked1(e.detail.tile);
        evalGameComplete(gameData);
    });
    gameData.gameboardElement.addEventListener('tile-clicked-2', e => {
        tileClicked2(e.detail.tile);
        evalGameComplete(gameData);
    });
}
