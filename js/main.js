

// create tile array for play
const tiles = [];

function createTile(x, y) {
    tiles.push({
        id: tiles.length,
        x,
        y
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
        el.style.backgroundColor = 'green';

        fragment.appendChild(el);
        el.onclick = (e) => {
            el.style.backgroundColor = 'red';
            // document.dispatchEvent(new CustomEvent('tile-clicked', { detail: { tile } }));
        };
    }

    const gameboardElement = document.getElementById("gameboard");
    gameboardElement.appendChild(fragment);

}

function getTileElement(id) {
    return document.getElementById('tile' + id);
}


const gameConfig = {
    numCols: 4,
    numRows: 5
};



for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
        createTile(x,y);
    }
}

drawTileElements();

