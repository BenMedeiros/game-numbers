'use strict';

export function createUndoBtnElement(gameData) {
    const btn = document.createElement("btn");
    btn.id = 'undo-btn';

    const el = document.createElement("i");
    el.classList.add('material-icons');
    el.innerText = 'undo';

    document.getElementById("gameboard").appendChild(el);


}
