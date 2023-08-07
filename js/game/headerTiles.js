'use strict';

import gameConfig from "./gameConfig.js";
import gameData from "./gameData.js";

export function createHeaderTiles() {
    for (let x = 0; x < gameConfig.numCols; x++) {
        gameData.headerTiles.push({
            id: 'headerTile' + gameData.headerTiles.length,
            type: 'top',
            x,
            y: -1,
            chainSequence: []
        });
    }

    for (let y = 0; y < gameConfig.numRows; y++) {
        gameData.headerTiles.push({
            id: 'headerTile' + gameData.headerTiles.length,
            type: 'left',
            x: -1,
            y,
            chainSequence: []
        });
    }
}

function addChain(headerTile, chain) {
    if (chain !== 0) {
        headerTile.chainSequence.push({
            found: false,
            chain,
            elId: 'headerTile-' + headerTile.id + headerTile.chainSequence.length
        });
    }
}

export function calculateHeaderTileChains() {
    //populate the top row headers
    for (let x = 0; x < gameConfig.numCols; x++) {
        let chain = 0;
        for (let y = 0; y < gameConfig.numRows; y++) {
            if (gameData.tiles[x * gameConfig.numRows + y].isFilled) {
                chain++;
            } else {
                if (chain !== 0) {
                    addChain(gameData.headerTiles[x], chain);
                    chain = 0;
                }
            }
        }
        addChain(gameData.headerTiles[x], chain);
    }
    //populate the left side headers
    for (let y = 0; y < gameConfig.numRows; y++) {
        let chain = 0;
        for (let x = 0; x < gameConfig.numCols; x++) {
            if (gameData.tiles[x * gameConfig.numRows + y].isFilled) {
                chain++;
            } else {
                if (chain !== 0) {
                    addChain(gameData.headerTiles[gameConfig.numCols + y], chain);
                    chain = 0;
                }
            }
        }
        addChain(gameData.headerTiles[gameConfig.numCols + y], chain);
    }
}

export function calculateChainStateAfterTileChange(thisTile) {
    for (const headerTile of gameData.headerTiles) {
        if (thisTile.x === headerTile.x || thisTile.y === headerTile.y) {
            if (headerTile.type === 'top') {
                const tilesInColumn = gameData.tiles.filter(t => t.x === headerTile.x).sort((a, b) => {
                    return a > b ? 1 : 0;
                });
                resolveBooleanMatches(headerTile.chainSequence, calculateChainSequence(tilesInColumn));
            }else{
                const tilesInRow = gameData.tiles.filter(t => t.y === headerTile.y).sort((a, b) => {
                    return a > b ? 1 : 0;
                });
                resolveBooleanMatches(headerTile.chainSequence, calculateChainSequence(tilesInRow));
            }
        }
    }
}

//calculate chain sequence for a presorted list of tiles
function calculateChainSequence(tiles) {
    let chain = 0;
    const chainSequence = [];
    for (const tile of tiles) {
        if (tile.state === 'click1') {
            chain++;
        } else if (chain > 0) {
            chainSequence.push(chain);
            chain = 0;
        }
    }
    if (chain > 0) chainSequence.push(chain);
    return chainSequence;
}

// updates header tile chain if the chain part is valid
function resolveBooleanMatches(headerChainSeq, tileChainSeq) {
    const chainMatches = Array.from(headerChainSeq).fill(false);
    //check for matches forwards
    for (let i = 0; i < headerChainSeq.length; i++) {
        if (headerChainSeq[i].chain === tileChainSeq[0]) {
            chainMatches[i] = true;
            tileChainSeq.splice(0, 1);
        }
    }
    //update the header.chainSequence as found true/false
    for (let i = 0; i < headerChainSeq.length; i++) {
        if (tileChainSeq.length > 0) {
            //    too many matches, so invalidate the whole thing
            headerChainSeq[i].found = false;
        } else {
            headerChainSeq[i].found = chainMatches[i];
        }
    }
}