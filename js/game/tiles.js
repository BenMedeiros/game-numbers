'use strict';

import {saveMoveHistory} from "./moveHistory.js";

export {
    createTiles,
    clearTiles,
}

function clearTiles(tiles) {
    tiles.length = 0;
}

function createTiles(tiles, gameConfig, gameData) {
    for (let x = 0; x < gameConfig.numCols; x++) {
        for (let y = 0; y < gameConfig.numRows; y++) {
            const tile = {
                id: tiles.length,
                x,
                y,
            };

            Object.defineProperties(tile, {
                elId: {
                    enumerable: false,
                    get() {
                        return 'tile' + this.id
                    }
                },
                isFilled: {
                    get() {
                        return isTileInState(this.id, gameConfig.gameIdPartitioned);
                    }
                },
                state: {
                    get() {
                        //    state is stored like isFilled, showing current user clicks
                        if (isTileInState(this.id, gameData.stateClick1)) {
                            return 'click1';
                        } else if (isTileInState(this.id, gameData.stateClick2)) {
                            return 'click2';
                        } else {
                            return 'unclicked';
                        }
                    },
                    set(newState) {
                        updateGameDataClickState(gameData, this, newState);
                        console.log(gameConfig.gameIdPartitioned, gameData.stateClick1, gameData.stateClick2);
                    }
                }
            });

            tiles.push(tile);
        }
    }
}

function isTileInState(tileId, stateArray) {
    //find the partition this tile lives in
    const partitionIndex = Math.floor(tileId / 30);
    const tileBitIndex = 1 << (tileId % 30);

    const pState = stateArray[partitionIndex]
    // gameId stores binary of which tiles are filled
    // bitwise AND is non zero if match
    return (pState & tileBitIndex) > 0
}

function setTileStateToTrue(tileId, stateArray) {
    const partitionIndex = Math.floor(tileId / 30);
    const tileBitIndex = 1 << (tileId % 30);
    // [int in the array][bit in the int]
    stateArray[partitionIndex] |= tileBitIndex;
}

function setTileStateToFalse(tileId, stateArray) {
    const partitionIndex = Math.floor(tileId / 30);
    const tileBitIndex = 1 << (tileId % 30);
    // [int in the array][bit in the int]
    stateArray[partitionIndex] &= ~tileBitIndex;
}

//update tile.state (aka gameData.state) to a specific state (ignores user flow paths)
function updateGameDataClickState(gameData, tile, newState) {
    if (tile.state === newState) {
        //    nothing needed
        return;
    }

    saveMoveHistory(tile, newState, gameData);

    if (newState === 'unclicked') {
        setTileStateToFalse(tile.id, gameData.stateClick1);
        setTileStateToFalse(tile.id, gameData.stateClick2);

    } else if (newState === 'click1') {
        setTileStateToTrue(tile.id, gameData.stateClick1);
        setTileStateToFalse(tile.id, gameData.stateClick2);

    } else if (newState === 'click2') {
        setTileStateToTrue(tile.id, gameData.stateClick2);
        setTileStateToFalse(tile.id, gameData.stateClick1);
    }
}