'use strict';

import TILE_STATES from "../game/tile_states.js";
import {roundToPrecisionString} from "../common/utils.js";

export {
    drawTileElements,
    newGameBoardElement,
    updateTileElementState
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

    const timerEl = document.createElement("div");
    timerEl.id = 'timer';
    timerEl.classList.add('timer');
    timerEl.innerText = '0';
    el.appendChild(timerEl);
    const intervalId = setInterval(() => {
        timerEl.innerText = roundToPrecisionString(gameData.timeElapsed, 2) + ' s';
    }, 100);
    document.addEventListener('new-game', () => {
        setTimeout(() => clearInterval(intervalId), 100);
    }, {once: true});

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

function updateTileElementState(tile, el) {
    if (tile.state === TILE_STATES.UNCLICKED) {
        el.classList.remove('click1');
        el.classList.remove('click2');
    } else if (tile.state === TILE_STATES.CLICK1) {
        el.classList.add('click1');
        el.classList.remove('click2');
    } else if (tile.state === TILE_STATES.CLICK2) {
        el.classList.add('click2');
        el.classList.remove('click1');
    } else {
        throw new Error('Impossible');
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
        updateTileElementState(tile, el);

        fragment.appendChild(el);
        el.onclick = (e) => {
            gameData.gameboardElement.dispatchEvent(new CustomEvent('tile-clicked-1', {detail: {tile}}));
        };

        el.addEventListener("contextmenu", e => {
            e.preventDefault();
            gameData.gameboardElement.dispatchEvent(new CustomEvent('tile-clicked-2', {detail: {tile}}));
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
