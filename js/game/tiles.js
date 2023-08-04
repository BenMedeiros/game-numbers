'use strict';

import {randomFrom} from "../common/utils.js";
import TILE_STATES from "./tile_states.js";

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
                id: 1 << tiles.length,
                x,
                y,
                state: TILE_STATES.UNCLICKED,
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
                        // gameId stores binary of which tiles are filled
                        // bitwise OR is non zero if match
                        return (gameConfig.gameId & this.id) > 0
                    }
                },
                state: {
                    get() {
                        //    state is stored like isFilled, showing current user clicks
                        if ((gameData.stateClick1 & this.id) > 0) {
                            return TILE_STATES.CLICK1;
                        } else if ((gameData.stateClick2 & this.id) > 0) {
                            return TILE_STATES.CLICK2;
                        } else {
                            return TILE_STATES.UNCLICKED;
                        }
                    },
                    set(newState) {
                        updateGameDataClickState(gameData, this, newState);
                    }
                }
            });

            tiles.push(tile);
        }
    }
}

//update tile.state (aka gameData.state) to a specific state (ignores user flow paths)
function updateGameDataClickState(gameData, tile, newState) {
    if (tile.state === newState) {
        //    nothing needed
    } else if (newState === TILE_STATES.UNCLICKED) {
        // set click1's bit to 1 and click2's to 0
        gameData.stateClick1 = gameData.stateClick1 & ~tile.id;
        gameData.stateClick2 = gameData.stateClick2 & ~tile.id;

    } else if (newState === TILE_STATES.CLICK1) {
        // set click1's bit to 1 and click2's to 0
        gameData.stateClick1 = gameData.stateClick1 | tile.id;
        gameData.stateClick2 = gameData.stateClick2 & ~tile.id;

    } else if (newState === TILE_STATES.CLICK2) {
        // set click2's bit to 1 and click1's to 0
        gameData.stateClick2 = gameData.stateClick2 | tile.id;
        gameData.stateClick1 = gameData.stateClick1 & ~tile.id;
    }
}