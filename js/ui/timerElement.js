'use strict';

import {roundToPrecisionString} from "../common/utils.js";

export function createTimerElement(gameData) {
    const el = document.createElement("div");
    el.id = 'timer';
    el.classList.add('timer');
    el.innerText = '0';
    document.getElementById("gameboard").appendChild(el);

    const intervalId = setInterval(() => {
        el.innerText = roundToPrecisionString(gameData.timeElapsed, 2) + ' s';
    }, 100);

    document.addEventListener('new-game', () => {
        setTimeout(() => clearInterval(intervalId), 100);
    }, {once: true});
}
