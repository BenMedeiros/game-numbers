'use strict'

import gameData from "./gameData.js";
import gameConfig from "./gameConfig.js";
import {updateTileState} from "./gameStateManager.js";

const solveObjects = [];

// document.addEventListener('new-game', () => setTimeout(resetSolver, 1000));

export function resetSolver() {
    solveObjects.length = 0;

    for (let i = 0; i < gameConfig.numRows; i++) {
        const headerTile = gameData.headerTiles.find(el => el.type === 'left' && el.y === i);
        solveObjects.push({
            type: 'row',
            sequence: headerTile.chainSequence.map(cs => cs.chain),
            tiles: gameData.tiles.filter(el => el.y === i)
        });
    }
    for (let i = 0; i < gameConfig.numCols; i++) {
        const headerTile = gameData.headerTiles.find(el => el.type === 'top' && el.x === i);
        solveObjects.push({
            type: 'col',
            sequence: headerTile.chainSequence.map(cs => cs.chain),
            tiles: gameData.tiles.filter(el => el.x === i)
        });
    }

    console.log(solveObjects);
}


export function fillNegativeSpaces() {
    for (const obj of solveObjects) {
        if (obj.tiles.length === 0) continue; //obj already solved
        trimChainSequence(obj);

        //this logic is designed initially for just 1 chain
        if (obj.sequence.length !== 1) continue;
        const chainLength = obj.sequence[0];

        let firstClick1 = null;
        let lastClick2 = -1; // (essentially, makes the logic easier)
        for (let i = 0; i < obj.tiles.length; i++) {
            if (obj.tiles[i].state === 'unclicked') {
                //    can't reach this distance on rightmost side
                if (firstClick1 !== null) {
                    if (firstClick1 + chainLength <= i) {
                        updateTileState(obj.tiles[i], 'click2');
                        lastClick2 = i;
                    }
                }

            } else if (obj.tiles[i].state === 'click1') {
                //if this is the first edge of click1, leftmost tile is limited
                if (firstClick1 === null) {
                    if (i - chainLength > lastClick2) {
                        for (let j = lastClick2 + 1; j < i - chainLength + 1; j++) {
                            updateTileState(obj.tiles[j], 'click2');
                        }
                        lastClick2 = i;
                    }
                }
                firstClick1 = i;

            } else if (obj.tiles[i].state === 'click2') {
                if (firstClick1 === null) {
                    //    no click1 found yet, but could be here if the size fits,
                    //    if size doesn't fit we know it's click2
                    if (i - lastClick2 - 1 < chainLength) {
                        console.log(i, lastClick2);
                        //fill in all between this gap as click2 since it can't fit here
                        for (let j = lastClick2 + 1; j < i; j++) {
                            updateTileState(obj.tiles[j], 'click2');
                        }
                    }
                } else {
                    //    row already has some filled previously, so everything after this is click2
                    for (let j = i; j < obj.tiles.length; j++) {
                        updateTileState(obj.tiles[j], 'click2');
                    }
                    //remove all the extra tiles (ie. trim)
                    obj.tiles.length = i - 1;
                    break;
                }
                lastClick2 = i;
            }
        }

        //    check for space at the end
        if (chainLength > obj.tiles.length - lastClick2 - 1) {
            for (let j = lastClick2 + 1; j < obj.tiles.length; j++) {
                updateTileState(obj.tiles[j], 'click2');
            }
        }

    } //solveObjects
}


export function solvePartialSingleChain() {
    for (const obj of solveObjects) {
        if (obj.tiles.length === 0) continue; //obj already solved
        trimChainSequence(obj);
        console.log('---');
        //this logic is designed initially for just 1 chain
        if (obj.sequence.length !== 1) return;

        const chainLength = obj.sequence[0];
        // for a single sequence, a clicked tile means its touching here
        let flex = 0; //space to the left of chain (which could be on either side)
        let firstFill = null; // start of the chain known
        let lastFill = null // end of the chain known
        let lastClick2 = null; //click2 pointer to track spaces
        for (let i = 0; i < obj.tiles.length; i++) {
            if (obj.tiles[i].state === 'unclicked') {
                if (firstFill === null) {
                    flex++;
                } else if (flex === 0) {
                    //    if it's the first tile, fill until it reaches chain length
                    if (chainLength > i - firstFill) {
                        lastFill = i;
                        updateTileState(obj.tiles[i], 'click1');
                    } else {
                        //    chain length already met
                        updateTileState(obj.tiles[i], 'click2');
                    }

                }
            } else if (obj.tiles[i].state === 'click1') {
                if (firstFill === null && flex === 0) {
                    //    start of the tiles, so fill all
                    firstFill = 0;
                    lastFill = chainLength - 1;
                    break;
                }
                if (firstFill === null) {
                    firstFill = i;
                    flex++;
                }
                lastFill = i;
                //    click2 create bounds of where this can exist
            } else if (obj.tiles[i].state === 'click2') {
                if (firstFill === null) {
                    //    no click1 found yet, but could be here if the size fits,
                    //    if size doesn't fit we know it's click2
                    if (i - lastClick2 < chainLength) {
                        //fill in all between this gap as click2 since it can't fit here
                        for (let j = lastClick2; j < i; j++) {
                            updateTileState(obj.tiles[j], 'click2');
                        }
                    }
                } else {
                    //    row already has some filled previously, so everything after this is click2
                    updateTileState(obj.tiles[i], 'click2');
                }
                lastClick2 = i;
            }

            console.log(obj.type, obj.sequence, i, flex, firstFill, lastFill);
        }

        if (firstFill && lastFill) {
            // fill based on known start/ends
            for (let i = 0; i < obj.tiles.length; i++) {
                //guarenteed in the set
                if (firstFill <= i && i <= lastFill) {
                    updateTileState(obj.tiles[i], 'click1');
                    //    within the possibility, but not guarenteed, so unclicked
                } else if (firstFill - flex <= i && i <= lastFill + flex) {

                }
            }
        }

    }
}

export function findPermutations() {
    resetSolver();
//    build all possible combinations of using the chains
//    if a tile is click1 or click2 for every permutation, it must always be that
//     this should handle:
//     solve span match
//     clik1 done
//     solves ones

    let movesMade = 0;

    for (const obj of solveObjects) {
        console.log('START ', obj.type, obj.sequence);
        // obj already solved
        if (obj.tiles.find(tile => tile.state === 'unclicked') === undefined) continue;

        const result = getPossibleMatches(obj.tiles.map(tile => tile.state), obj.sequence, 0);
        console.log('FINAL', obj.type, obj.sequence, result);
        console.log('');
        console.log('');

        if (!result) {
            console.error(obj);
            throw new Error('Chain Sequence has no solution possible.');
        }

        for (let i = 0; i < obj.tiles.length; i++) {
            //already solved
            if (obj.tiles[i].state !== 'unclicked') continue;

            let hasClick1 = false;
            let hasClick2 = false;
            for (const possibleMatch of result) {
                // could break from here, but roughly same speed given data sets
                if (possibleMatch[i] === click1Match) {
                    hasClick1 = true;
                } else {
                    hasClick2 = true;
                }
            }

            if (hasClick1 && hasClick2) {
                //    still unknown/unclicked, do nothing
            } else if (hasClick1 && !hasClick2) {
                updateTileState(obj.tiles[i], 'click1');
                movesMade++;
            } else if (!hasClick1 && hasClick2) {
                updateTileState(obj.tiles[i], 'click2');
                movesMade++;
            } else {
                throw new Error('Impossible, maybe this is empty array?');
            }
        }
    }

    console.log('TOTAL MOVES MADE', movesMade);
}

//root solve object, 0 - click2, 1 - click1
const click2Match = 0;
const click1Match = 1;

function getPossibleMatches(rootTilesStates, remainingSequence, currentIndex) {
    const result = [];

    // done solving sequences
    if (remainingSequence.length === 0) {
        console.log('sequence solved, remaining tiles are click2');

        result.push([]);
        for (let i = currentIndex; i < rootTilesStates.length; i++) {
            //if there are any click1s back here, we know this is invalid
            if (rootTilesStates[i] === 'click1') {
                return false;
            }
            result[0].push(click2Match);
        }
        return result;
    }

    const tilesRemaining = rootTilesStates.length - currentIndex;
    const tileSpanNeed = remainingSequence.reduce((a, b) => a + b) + remainingSequence.length - 1;
    // a click1 limits how much flex is possible, since we know it must at most start there
    const distanceToFirstClick1 = rootTilesStates.indexOf('click1', currentIndex) - currentIndex;
    const flex = Math.min(tilesRemaining - tileSpanNeed, (distanceToFirstClick1 < 0 ? Infinity : distanceToFirstClick1));

    if (flex < 0) {
        console.log('flex < 0', tilesRemaining, tileSpanNeed, flex);
        return false;
    }

    // the first chain can go here or up to flex tiles from here
    for (let i = 0; i < flex + 1; i++) {
        // check if this flex is possible based on existing click1/click2
        let flexValid = true;
        for (let j = 0; j < remainingSequence[0]; j++) {
            // check the entire chain for overlap with any click2
            if (rootTilesStates[currentIndex + i + j] === 'click2') {
                //    we're trying to put a click1 here, but it's already a click2, so skip this flex match
                flexValid = false;
                console.log('flex not valid - click2 overlap', currentIndex, i, remainingSequence[0]);
            }
        }
        //check if we can place the click2 for these flexes (tiles before and after the chain can't be click1)
        if (rootTilesStates[currentIndex + i - 1] === 'click1') {
            flexValid = false;
            console.log('flex not valid - left', currentIndex, i, remainingSequence[0]);
        } else if (rootTilesStates[currentIndex + i + remainingSequence[0]] === 'click1') {
            flexValid = false;
            console.log('flex not valid - right', currentIndex, i, remainingSequence[0]);
        }


        if (flexValid === false) continue;

        console.log('');
        console.log('getPossibleMatches');
        console.log('currentIndex', currentIndex, 'remainingSequence', remainingSequence,
            'flex', flex, 'i', i, 'new index', currentIndex + i + remainingSequence[0] + 1);

        // i == this flex; remainingSequence[0] +1 == chain length + a click2 after the chain
        const newIndex = currentIndex + i + remainingSequence[0] + 1;
        const children = getPossibleMatches(rootTilesStates, remainingSequence.slice(1), newIndex);
        console.log('children', JSON.stringify(children));
        //[[possible match]] -  array of all possible matches below
        if (!children) continue; // no possible child matches

        for (const child of children) {
            //if child is invalid/unsolvable ignore it
            if (!child) continue;
            //put a click2 for every flex scenario then the chain, then the children
            result.push([].concat(Array(i).fill(click2Match)) //flex click2 fillers
                .concat(Array(remainingSequence[0]).fill(click1Match)) // the chain
                //this will put an extra click2 a the end, but it doesn't really matter
                .concat(click2Match) // there is always a click2 after a chain
                .concat(child));
        }
    }

    if (result.length === 0 && remainingSequence.length !== 0) {
        console.log('No results created, so must be invalid');
        return false;
    }

    console.log(result);
    return result;
}


function trimChainSequence(obj) {
    // remove tiles from ends of array since they provide no information
    if (obj.tiles.length === 0) {
        return;
    } else if (obj.tiles[0].state === 'click2') {
        obj.tiles.shift();
        trimChainSequence(obj);
    } else if (obj.tiles[obj.tiles.length - 1].state === 'click2') {
        obj.tiles.pop();
        trimChainSequence(obj);
    }
}
