'use strict';

import {TextPageType} from "../html/tinyComponents/TextPageType.js";

const mainTag = document.getElementById("main");

let helpScreenElement = null;

//inline span elements using mostly the generic classes
const tile0Span = `<span class="tile">U</span>`;
const tile1Span = `<span class="tile click1">T</span>`;
const tile2Span = `<span class="tile click2">F</span>`;
const seq1Span = `<span class="left-header-tile">1</span>`;
const seq2Span = `<span class="left-header-tile">2</span>`;


export function createHelpScreen() {
    if (helpScreenElement) helpScreenElement.remove();

    const page = new TextPageType('help-screen', 'Help');
    page.h3('Goal');
    page.p('Find the tile combination that satisfies the sequences shown on the top and left of the board. ' +
        'You win when you correctly identify all marked/true tiles.');

    page.h4('Sequences');
    page.p('Each row/column is composed of a sequence of numbers.  Each circular number tells' +
        ' you how many tiles are adjacent within that row/column.  Numbers within a sequence are separated ' +
        'by at least 1 tile.');

    page.h4('Tiles');
    page.p(tile0Span + ' Unknown/unmarked tiles.');
    page.p(tile1Span + ' Tiles marked as known true.');
    page.p(tile2Span + ' Tiles marked as known false.')

    page.h3('Examples');
    page.h4('Example 1');
    page.p('If the row has 4 tiles ' + tile0Span + tile0Span + tile0Span + tile0Span +
        ' and a sequence of ' + seq1Span + seq2Span + ', the result would be ' +
        tile1Span + tile2Span + tile1Span + tile1Span);
    page.h4('Example 2');
    page.p('If the row has 5 tiles ' + tile0Span + tile0Span + tile0Span + tile0Span + tile0Span +
        ' and a sequence of ' + seq1Span + seq2Span + ', you cannot immediately solve the row because ' +
        'there are 4 ' + tile2Span + ' that need to be placed, and there is not enough information to do it.  Possible answers are: ');
    page.p(tile2Span + tile1Span + tile2Span + tile1Span + tile1Span);
    page.p(tile1Span + tile2Span + tile2Span + tile1Span + tile1Span);
    page.p(tile1Span + tile2Span + tile1Span + tile1Span + tile2Span);
    page.p('As you solve other rows/columns you will build clues to help find the solution.');

    page.h3('Controls');
    page.h4('PC');
    page.p('Left-click ' + tile0Span + ': Mark as ' + tile1Span);
    page.p('Right-click ' + tile0Span + ': Mark as ' + tile2Span);
    page.p('Left-click/Right-click Marked Tile: Mark as ' + tile0Span);
    page.p('Click-drag: Mark/unmark multiple tiles at once.');
    page.h4('Mobile:');
    page.p('Press ' + tile0Span + ': Mark as ' + tile1Span);
    page.p('Long-press ' + tile0Span + ': Mark as ' + tile2Span);
    page.p('Press Marked Tile: Mark as ' + tile0Span);

    page.h3('Controls Menu');
    page.p('Undo Move');
    page.p('Branch - Save a checkpoint of your game that can be restored.  This is useful if you are making ' +
        'a guess and want to be able to undo all moves made after the guess.');
    page.p('Restore - Restores the Branch that was created.  You can create as many branches as needed.');

    helpScreenElement = page.createElementIn(mainTag);

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