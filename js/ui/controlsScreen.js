'use strict';

import {
    createBranch,
    restoreBranch, saveMoveHistory,
    undoLastMove
} from "../game/moveHistory.js";
import gameData from "../game/gameData.js";
import {
    branchAllowed,
    branchCreated,
    branchDeleted,
    branchNotAllowed, moveHistoryEmpty,
    moveMade,
    onFunctionEvent, removeFunctionEvents
} from "../common/eventHandler.js";

const mainTag = document.getElementById("main");

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

    onFunctionEvent(branchCreated, el.id, createBranchInstanceElement);

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

    btn.disabled = true;
    onFunctionEvent(moveMade, btn.id, () => btn.disabled = false);
    onFunctionEvent(moveHistoryEmpty, btn.id, () => btn.disabled = true);

    return btn;
}

export function createBranchBtnElement() {
    const btn = document.createElement("button");
    btn.id = 'branch-btn';
    btn.classList.add('branch');
    btn.innerText = 'Branch';
    btn.disabled = true;
    btn.onclick = createBranch;

    onFunctionEvent(branchCreated, btn.id, () => btn.disabled = true);
    onFunctionEvent(branchNotAllowed, btn.id, () => btn.disabled = true);
    onFunctionEvent(moveHistoryEmpty, btn.id, () => btn.disabled = true);
    onFunctionEvent(branchAllowed, btn.id, () => btn.disabled = false);
    onFunctionEvent(moveMade, btn.id, () => btn.disabled = false);
    onFunctionEvent(branchDeleted, btn.id, () => btn.disabled = false);

    return btn;
}

export function createBranchInstanceElement(branchIndex) {
    if (!controlsScreenElement) return;

    const btn = document.createElement("button");
    btn.id = 'branch-instance-' + branchIndex;
    btn.classList.add('branch-instance');
    btn.innerText = 'Restore ' + branchIndex;
    btn.onclick = () => restoreBranch(branchIndex);

    onFunctionEvent(branchDeleted, btn.id, (deletedBranchIndex) => {
        if (branchIndex === deletedBranchIndex) {
            removeFunctionEvents(btn.id);
            btn.remove();
        }
    });
    controlsScreenElement.appendChild(btn);
}

