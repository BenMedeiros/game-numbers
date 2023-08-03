'use strict';

// create tile array for play
const tiles = [];

const TILE_STATES = {
    UNCLICKED: 0,
    CLICK1: 1,
    CLICK2: 2
}

function createTile(x, y) {
    tiles.push({
        id: tiles.length,
        x,
        y,
        state: TILE_STATES.UNCLICKED
    });
}

function clearTiles() {
    tiles.length = 0;
}


function drawTileElements() {
    const fragment = document.createDocumentFragment();

    for (const tile of tiles) {
        const el = document.createElement("button");
        el.classList.add('tile');
        // el.classList.add('tile-road-tiles');
        // el.classList.add(tileTypes[tile.type]);
        el.id = 'tile' + tile.id;

        el.style.setProperty('--tile-x', tile.x);
        el.style.setProperty('--tile-y', tile.y);

        fragment.appendChild(el);
        el.onclick = (e) => {
            // document.dispatchEvent(new CustomEvent('tile-clicked', { detail: { tile } }));
            if (tile.state === TILE_STATES.UNCLICKED) {
                el.classList.add('click1');
                tile.state = TILE_STATES.CLICK1;
            } else if (tile.state === TILE_STATES.CLICK1) {
                el.classList.remove('click1');
                tile.state = TILE_STATES.UNCLICKED;
            } else if (tile.state === TILE_STATES.CLICK2) {
                el.classList.remove('click2');
                tile.state = TILE_STATES.UNCLICKED;
            } else {
                throw new Error('Impossible');
            }
        };

        el.addEventListener("contextmenu", e => {
            e.preventDefault();
            if (tile.state === TILE_STATES.UNCLICKED) {
                el.classList.add('click2');
                tile.state = TILE_STATES.CLICK2;
            } else if (tile.state === TILE_STATES.CLICK1) {
                el.classList.remove('click1');
                tile.state = TILE_STATES.UNCLICKED;
            } else if (tile.state === TILE_STATES.CLICK2) {
                el.classList.remove('click2');
                tile.state = TILE_STATES.UNCLICKED;
            } else {
                throw new Error('Impossible');
            }
        });

    }

    const gameboardElement = document.getElementById("gameboard");
    gameboardElement.appendChild(fragment);

}

function clearGameBoardElements() {
    const gameboardElement = document.getElementById("gameboard");
    let lastEl = gameboardElement.lastChild;
    while (lastEl) {
        lastEl.remove();
        lastEl = gameboardElement.lastChild;
    }
}

function updateGameBoard() {
    const gameboardElement = document.getElementById("gameboard");
    gameboardElement.style.setProperty('--num-cols', gameConfig.numCols);
    gameboardElement.style.setProperty('--num-rows', gameConfig.numRows);
}

function getTileElement(id) {
    return document.getElementById('tile' + id);
}


const gameConfig = {
    numCols: 4,
    numRows: 5
};


loadConfigFromStorage();
populateUiSettingsFromConfig();

function updateBoard() {
    readUiSettingsIntoConfig();
    saveConfigToStorage();
    clearTiles();
    clearGameBoardElements();
    updateGameBoard();

    for (let x = 0; x < gameConfig.numCols; x++) {
        for (let y = 0; y < gameConfig.numRows; y++) {
            createTile(x, y);
        }
    }

    console.log(tiles.length);
    drawTileElements();
}

setTimeout(updateBoard, 500);
