'use strict';

import TILE_STATES from "../game/tile_states.js";
import {roundToPrecisionString} from "../common/utils.js";

export default {
    drawTileElements,
    newGameBoardElement
}

function newGameBoardElement(gameConfig, gameData) {
    const oldGameboardElement = document.getElementById("gameboard");
    if (oldGameboardElement) clearGameBoardElements(oldGameboardElement);

    const el = document.createElement("div");
    el.id = 'gameboard';
    el.classList.add('gameboard');

    el.style.setProperty('--num-cols', gameConfig.numCols);
    el.style.setProperty('--num-rows', gameConfig.numRows);

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

function drawTileElements(gameboardElement, gameData) {
    const fragment = document.createDocumentFragment();

    for (const tile of gameData.tiles) {
        const el = document.createElement("button");
        el.classList.add('tile');
        el.id = tile.id;
        el.title = tile.id + ':' + tile.isFilled;

        el.style.setProperty('--tile-x', tile.x);
        el.style.setProperty('--tile-y', tile.y);

        fragment.appendChild(el);
        el.onclick = (e) => {
            gameData.gameboardElement.dispatchEvent(new CustomEvent('tile-clicked-1', {detail: {tile}}));
        };

        el.addEventListener("contextmenu", e => {
            e.preventDefault();
            gameData.gameboardElement.dispatchEvent(new CustomEvent('tile-clicked-2', {detail: {tile}}));
        });
    }

    for (const headerTile of gameData.headerTiles) {
        const el = document.createElement("ul");

        el.classList.add('header-tile');
        if(headerTile.x === -1) {
            el.classList.add('horizontal');
        }else{
            el.classList.add('vertical');
            el.style.setProperty('--chain-length-y', headerTile.chain.length+'');
        }

        el.id = headerTile.id;
        el.title = headerTile.id;
        el.style.setProperty('--tile-x', headerTile.x);
        el.style.setProperty('--tile-y', headerTile.y);

        for(const value of headerTile.chain){
            const listEl = document.createElement("li");
            const badgeEl = document.createElement("span");
            badgeEl.classList.add('badge');
            badgeEl.innerText = value;
            listEl.appendChild(badgeEl);
            el.appendChild(listEl);
        }

        fragment.appendChild(el);
    }

    gameboardElement.appendChild(fragment);

}


