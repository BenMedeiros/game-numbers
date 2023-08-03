'use strict';

function createWinScreen() {
    if (winScreenOpen) return;

    const el = document.createElement("div");
    el.id = 'win-screen';
    el.classList.add('win-screen');
    el.innerText = 'YOU WIN';

    const btnNewGame = document.createElement("button");
    btnNewGame.classList.add('new-game');
    btnNewGame.innerText = 'New Game';
    btnNewGame.onclick = () => document.dispatchEvent(new Event('new-game'));
    el.appendChild(btnNewGame);

    const mainTags = document.getElementsByTagName("main");
    if (mainTags.length !== 1) throw new Error('should only be 1 main tag in body');
    mainTags[0].appendChild(el);
    winScreenOpen = true;

    //not allowing off screen close-click for now
    //needs a delay because its still in the click event bubble sometimes
    // setTimeout(() => document.addEventListener('click', closeWinScreen), 100);
}

function closeWinScreen() {
    if(!winScreenOpen) return;
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