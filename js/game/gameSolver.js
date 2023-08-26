'use strict'

import gameData from "./gameData.js";
import gameConfig from "./gameConfig.js";
import {updateTileState} from "./gameStateManager.js";

const solveObjects = [];

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
}

export function solveAll() {
    //since we're gonna do the whole thing, take the time to reset solver
    resetSolver();
    while (solveOne()) ;
    console.log('All solved');
}

// function runs until it finds one move to make then returns true (or false if no move found).
export function solveOne() {
    //don't auto reset solver, because it only needs to be built once per new-game
    for (const obj of solveObjects) {
        // obj already solved
        if (obj.tiles.find(tile => tile.state === 'unclicked') === undefined) continue;

        const result = getPossibleMatches(obj.tiles.map(tile => tile.state), obj.sequence, 0);

        if (!result) {
            console.error(obj);
            throw new Error('Chain Sequence has no solution possible.');
        }

        for (let i = 0; i < obj.tiles.length; i++) {
            //already solved
            if (obj.tiles[i].state !== 'unclicked') continue;

            let hasClick1 = false;
            let hasClick2 = false;
            // if every possible match has a tile in a specific state, we know it must be that state
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
                return true; //each click only does one move
            } else if (!hasClick1 && hasClick2) {
                updateTileState(obj.tiles[i], 'click2');
                return true; //each click only does one move
            } else {
                throw new Error('Impossible, maybe this is empty array?');
            }
        }
    }

    return false;
}

//root solve object, 0 - click2, 1 - click1
const click2Match = 0;
const click1Match = 1;

// builds array of all possible state combinations that meet the chainSequence needs
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

    return result;
}
