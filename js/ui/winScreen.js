'use strict';

import {getBestTimeForSize} from "../game/gameHistory.js";
import gameData from "../game/gameData.js";
import gameConfig from "../game/gameConfig.js";
import {LabelInputType} from "../html/tinyComponents/LabelInputType.js";
import {SubmitType} from "../html/tinyComponents/SubmitType.js";

function createWinScreen(labelInputs) {
    if (winScreenOpen) return;

    const el = document.createElement("div");
    el.id = 'win-screen';
    el.classList.add('win-screen');

    const div = document.createElement("div");
    div.innerText = 'YOU WIN';
    el.appendChild(div);

    for (const labelInput of labelInputs) {
        labelInput.createElementIn(el);
    }

    const submit = new SubmitType('submit', 'New Game', 'new-game');
    submit.createElementIn(el);

    document.getElementById("main").appendChild(el);
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

document.addEventListener('game-won', () => {
    createWinScreen([
        new LabelInputType('numRows', 'number', 'Rows', gameConfig.numRows, null, true),
        new LabelInputType('numCols', 'number', 'Cols', gameConfig.numCols, null, true),
        new LabelInputType('gameId', 'string', 'Game Id', gameConfig.gameId, null, true),
        new LabelInputType('timeElapsed', 'number', 'Time', gameData.timeElapsed, null, true),
        new LabelInputType('bestTime', 'number', 'Record', getBestTimeForSize(gameConfig), null, true)
    ]);
});
document.addEventListener('new-game', closeWinScreen);

export default {
    isWinScreenOpen: () => {
        return winScreenOpen;
    },
    closeWinScreen
}