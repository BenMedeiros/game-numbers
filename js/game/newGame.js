'use strict';

import {randomFrom} from "../common/utils.js";

console.log('new game');
import TILE_STATES from "./tile_states.js";

export default {
    createTiles,
    clearTiles,
    createHeaderTiles,
    calculateHeaderTileText
}

function createTile(tiles, x, y) {
    return {
        id: 'tile'+tiles.length,
        x,
        y,
        state: TILE_STATES.UNCLICKED,
        isFilled: false // is the tile valid aka part of the numbers
    };
}

function clearTiles(tiles) {
    tiles.length = 0;
}

function createTiles(tiles, gameConfig) {
    for (let x = 0; x < gameConfig.numCols; x++) {
        for (let y = 0; y < gameConfig.numRows; y++) {
            const tile = createTile(tiles, x, y);
            tile.isFilled = randomFrom([true, true, false]);
            tiles.push(tile);
        }
    }
}

function createHeaderTiles(headerTiles, gameConfig) {
    for (let x = 0; x < gameConfig.numCols; x++) {
        headerTiles.push({
            id: 'headerTile'+headerTiles.length,
            x,
            y: -1,
            chain: []
        });
    }

    for (let y = 0; y < gameConfig.numRows; y++) {
        headerTiles.push({
            id: 'headerTile'+headerTiles.length,
            x: -1,
            y,
            chain: []
        });
    }
}

function calculateHeaderTileText(gameConfig, tiles, headerTiles) {
    //populate the top row headers
    for (let x = 0; x < gameConfig.numCols; x++) {
        let chain = 0;
        for (let y = 0; y < gameConfig.numRows; y++) {
            if (tiles[x * gameConfig.numRows + y].isFilled) {
                chain++;
            } else {
                if (chain !== 0) {
                    headerTiles[x].chain.push(chain);
                    chain = 0;
                }
            }
        }

        if(chain !== 0) headerTiles[x].chain.push(chain);
    }
    //populate the left side headers
    for (let y = 0; y < gameConfig.numRows; y++) {
        let chain = 0;
        for (let x = 0; x < gameConfig.numCols; x++) {
            if (tiles[x * gameConfig.numRows + y].isFilled) {
                chain++;
            } else {
                if (chain !== 0) {
                    headerTiles[gameConfig.numCols + y].chain.push(chain);
                    chain = 0;
                }
            }
        }

        if(chain !== 0) headerTiles[gameConfig.numCols + y].chain.push(chain);
    }
}