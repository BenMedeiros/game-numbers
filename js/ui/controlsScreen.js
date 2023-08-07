'use strict';

import {createBranch, getCurrentGameHistoryIndex, restoreBranch, undoLastMove} from "../game/moveHistory.js";
import gameData from "../game/gameData.js";

const mainTags = document.getElementsByTagName("main");
if (mainTags.length !== 1) throw new Error('should only be 1 main tag in body');
const mainTag = mainTags[0];

let controlsScreenElement = null;
document.addEventListener('new-game', () => {
    if (controlsScreenElement) controlsScreenElement.remove();
})

export function createControlsScreen() {
    const el = document.createElement("div");
    el.id = 'controls-screen';
    el.classList.add('controls');

    const textEl = document.createElement("h3");
    textEl.innerText = 'Controls';
    el.appendChild(textEl);

    el.appendChild(createUndoBtnElement());
    el.appendChild(createBranchBtnElement());
    controlsScreenElement = el;
    mainTag.appendChild(el);
}

export function createUndoBtnElement() {
    const btn = document.createElement("button");
    btn.id = 'undo-btn';
    btn.classList.add('undo');
    btn.onclick = () => undoLastMove(gameData);

    const el = document.createElement("i");
    el.classList.add('material-icons');
    el.innerText = 'undo';
    btn.appendChild(el);

    gameData.gameboardElement.addEventListener('move-history-empty', () => {
        btn.disabled = true;
    });
    gameData.gameboardElement.addEventListener('move-history-not-empty', () => {
        btn.disabled = false;
    });

    return btn;
}

export function createBranchBtnElement() {
    const btn = document.createElement("button");
    btn.id = 'branch-btn';
    btn.classList.add('branch');
    btn.innerText = 'Branch';
    btn.onclick = () => createBranchInstanceElement(createBranch());

    gameData.gameboardElement.addEventListener('branch-history-empty', () => {
        btn.disabled = true;
    });
    gameData.gameboardElement.addEventListener('branch-history-not-empty', () => {
        btn.disabled = false;
    });

    return btn;
}

export function createBranchInstanceElement(branchIndex) {
    if (!controlsScreenElement) return;

    const btn = document.createElement("button");
    btn.id = 'branch-instance-' + branchIndex;
    btn.classList.add('branch-instance');
    btn.innerText = 'Restore ' + branchIndex;
    btn.onclick = () => {
        console.log('onclick', getCurrentGameHistoryIndex(), branchIndex);
        for (let i = getCurrentGameHistoryIndex(); i >= branchIndex; i--) {
            const elToDelete = document.getElementById('branch-instance-'+i);
            elToDelete.remove();
        }

        restoreBranch(branchIndex);
        // btn.remove();
    };

    controlsScreenElement.appendChild(btn);
}