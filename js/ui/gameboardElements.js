'use strict';

import {roundToPrecisionString} from "../common/utils.js";
import {leftClickOrDrag, onTouchLongPress, rightClickOrDrag} from "../html/interactionHelpers.js";
import {
    setInitialDraggedState,
    updateTileStateAndElementDrag, updateTileStateAndElementToClick2
} from "../game/gameStateManager.js";

export {
    drawTileElements,
    newGameBoardElement,
}

function newGameBoardElement(gameConfig, gameData) {
    const oldGameboardElement = document.getElementById("gameboard");
    if (oldGameboardElement) clearGameBoardElements(oldGameboardElement);

    const el = document.createElement("div");
    el.id = 'gameboard';
    el.classList.add('gameboard');

    el.style.setProperty('--num-cols', gameConfig.numCols);
    el.style.setProperty('--num-rows', gameConfig.numRows);
    el.style.setProperty('--tile-size', gameConfig.tileSize + 'rem');

    oldGameboardElement.parentNode.replaceChild(el, oldGameboardElement);
    gameData.gameboardElement = el;
}

function clearGameBoardElements(gameboardElement) {
    let lastEl = gameboardElement.lastChild;
    while (lastEl) {
        lastEl.remove();
        lastEl = gameboardElement.lastChild;
    }
}

function drawTileElements(gameboardElement, gameData) {
    const fragment = document.createDocumentFragment();

    for (const tile of gameData.tiles) {
        const el = document.createElement("button");
        el.classList.add('tile');
        el.id = tile.elId;
        el.innerText = tile.id;
        el.title = tile.elId + ':' + tile.isFilled;

        el.style.setProperty('--tile-x', tile.x);
        el.style.setProperty('--tile-y', tile.y);

        fragment.appendChild(el);

        //disable generic right click menu
        el.oncontextmenu = e => e.preventDefault();

        el.addEventListener('mousedown', () => setInitialDraggedState(tile.state));

        leftClickOrDrag(el, () => {
            updateTileStateAndElementDrag(tile, el, 'click1');
        });

        rightClickOrDrag(el, () => {
            updateTileStateAndElementDrag(tile, el, 'click2')
        });

        onTouchLongPress(el, 700, () => {
            updateTileStateAndElementToClick2(tile, el);
        });
    }

    drawHeaderTileElements(gameData, gameboardElement, fragment);
    gameboardElement.appendChild(fragment);
}

function drawHeaderTileElements(gameData, gameboardElement, fragment) {
    //max chain is to know how much space to add for header elements of left/top
    let maxChainY = 0;
    let maxChainX = 0;
    for (const headerTile of gameData.headerTiles) {
        if (headerTile.type === 'left') {
            if (headerTile.chain.length > maxChainX) maxChainX = headerTile.chain.length;
        } else {
            if (headerTile.chain.length > maxChainY) maxChainY = headerTile.chain.length;
        }

        for (let i = 0; i < headerTile.chain.length; i++) {
            const el = document.createElement("div");
            el.innerText = headerTile.chain[i];

            if (headerTile.type === 'left') {
                el.classList.add('left-header-tile');
                el.style.setProperty('--tile-x', String((i - headerTile.chain.length) / 2));
                el.style.setProperty('--tile-y', headerTile.y);
            } else {
                el.classList.add('top-header-tile');
                el.style.setProperty('--tile-x', headerTile.x);
                el.style.setProperty('--tile-y', String((i - headerTile.chain.length) / 2));
                if (headerTile.chain.length > maxChainY) maxChainY = headerTile.chain.length;
            }

            fragment.appendChild(el);
        }
    }

    gameboardElement.style.setProperty('--max-chain-length-x', maxChainX + '');
    gameboardElement.style.setProperty('--max-chain-length-y', maxChainY + '');
}
