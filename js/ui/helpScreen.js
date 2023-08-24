'use strict';

const mainTag = document.getElementById("main");

let helpScreenElement = null;

export function createHelpScreen(){
    if(helpScreenElement) helpScreenElement.remove();

    const el = document.createElement("div");
    el.id = 'help-screen';
    el.classList.add('help');

    const textEl = document.createElement("h3");
    textEl.innerText = 'Help';
    el.appendChild(textEl);

    const p1 = document.createElement("p");
    p1.innerText = 'Getting Started';
    el.appendChild(p1);

    const p2 = document.createElement("p");
    p2.innerText = 'Goal: Find the tile combination that satisfies the sequences shown on the top and left ' +
        'of the board.' +
        '' +
        'Sequences: Each row/column is composed of a sequence of numbers.  Each circular number tells you ' +
        'how many tiles are adjacent within that row/column.  Numbers within a sequence are separated by at ' +
        'least 1 tile.  ' +
        '' +
        'Example 1: if the row has 4 tiles and a sequence of 1 2, the result would be TFTT, ' +
        'where T = True/tile found; F = False/no tile.' +
        'Example 2: if the row has 5 tiles and a sequence of 1 2, you cannot immediately solve the row because ' +
        'there are 4 F that need to be placed, and there is not enough information to do it.  Possible answers are: ' +
        'FTFTT, TFFTT, TFTTF.  As you solve other rows/columns you will build clues to help find the solution.' +
        '' +
        'Controls: ' +
        'PC: ' +
        'Left-click Unknown Tile: Mark as known-found (True).' +
        'Right-click Unknown Tile: Mark as known-wrong (False).' +
        'Left-click/Right-click Marked Tile: Unmark tile.' +
        'Click-drag: Mark/unmark multiple tiles at once.' +
        '' +
        'Mobile:' +
        'Press Unknown Tile: Mark as known-found (True).' +
        'Long-press Unknown Tile: Mark as known-wrong (False).' +
        'Press Marked Tile: Unmark tile.';
    el.appendChild(p2);

    mainTag.appendChild(el);
    helpScreenElement = el;

    helpScreenElement.addEventListener('click', (event) => {
        console.log('clicked inside');
        event.stopPropagation();
        if (helpScreenElement.classList.contains('collapsed')) {
            helpScreenElement.classList.remove('collapsed');
        }
    });
}



document.addEventListener('click', (event) => {
    console.log('clicked outside');
    if (!helpScreenElement.classList.contains('collapsed')) {
        helpScreenElement.classList.add('collapsed');
    }
});