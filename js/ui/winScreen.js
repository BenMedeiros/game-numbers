'use strict';

import {appendLabelAndInput} from "../html/tinyComponents.js";
import {getBestTimeForSize} from "../game/gameHistory.js";

const mainTags = document.getElementsByTagName("main");
if (mainTags.length !== 1) throw new Error('should only be 1 main tag in body');
const mainTag = mainTags[0];

function createWinScreen(event) {
    if (winScreenOpen) return;

    const el = document.createElement("div");
    el.id = 'win-screen';
    el.classList.add('win-screen');
    el.innerText = 'YOU WIN';

    appendLabelAndInput(el, 'rows', 'Rows', event.detail.gameConfig.numRows);
    appendLabelAndInput(el, 'cols', 'Cols', event.detail.gameConfig.numCols);
    appendLabelAndInput(el, 'gameId', 'Game Id', event.detail.gameConfig.gameId);
    appendLabelAndInput(el, 'timeElapsed', 'Time', event.detail.gameData.timeElapsed);
    appendLabelAndInput(el, 'bestTime', 'Record', getBestTimeForSize(event.detail.gameConfig));


    const btnNewGame = document.createElement("button");
    btnNewGame.classList.add('new-game');
    btnNewGame.innerText = 'New Game';
    btnNewGame.onclick = () => document.dispatchEvent(new Event('new-game'));
    el.appendChild(btnNewGame);

    mainTag.appendChild(el);
    winScreenOpen = true;
}

function closeWinScreen() {
    if (!winScreenOpen) return;
    console.log('closing');
    const oldGameboardElement = document.getElementById("win-screen");
    oldGameboardElement.remove();
    winScreenOpen = false;
}


let winScreenOpen = false;

document.addEventListener('game-won', createWinScreen);
document.addEventListener('new-game', closeWinScreen);

export default {
    isWinScreenOpen: () => {
        return winScreenOpen;
    },
    closeWinScreen
}