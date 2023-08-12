'use strict';

import {createBranch, restoreBranch, undoLastMove} from "../game/moveHistory.js";
import {
    branchAllowed,
    branchCreated,
    branchDeleted,
    branchNotAllowed, moveHistoryEmpty,
    moveMade,
    onFunctionEvent,
} from "../common/eventHandler.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";
import {fillNegativeSpaces, findPermutations, solvePartialSingleChain} from "../game/gameSolver.js";

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

    new ButtonType('solve', 'Solve Partial Single Chain', solvePartialSingleChain).createElementIn(el);
    new ButtonType('solve', 'Fill Negative Spaces', fillNegativeSpaces).createElementIn(el);
    new ButtonType('solve', 'Find Permutations', findPermutations).createElementIn(el);



    const undoBtn = new ButtonType('undo-btn', null, undoLastMove, true, 'undo');
    undoBtn.createElementIn(el);
    undoBtn.disableOnFunctionEvents([moveHistoryEmpty]);
    undoBtn.enableOnFunctionEvents([moveMade]);

    const branchBtn = new ButtonType('branch-btn', 'Branch', createBranch, true);
    branchBtn.createElementIn(el);
    branchBtn.disableOnFunctionEvents([branchCreated, branchNotAllowed, moveHistoryEmpty]);
    branchBtn.enableOnFunctionEvents([branchAllowed, moveMade, branchDeleted]);

    controlsScreenElement = el;

    onFunctionEvent(branchCreated, el.id, createBranchInstanceElement);

    mainTag.appendChild(el);
}

export function createBranchInstanceElement(branchIndex) {
    if (!controlsScreenElement) return;

    const btn = new ButtonType('branch-instance' + branchIndex, 'Restore ' + branchIndex,
        () => restoreBranch(branchIndex), false);
    btn.createElementIn(controlsScreenElement);
    btn.onFunctionEvent(branchDeleted, (deletedBranchIndex) => {
        if (branchIndex === deletedBranchIndex) {
            btn.deleteEl();
        }
    });
}

