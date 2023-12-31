'use strict';

import {ButtonType} from "../html/tinyComponents/ButtonType.js";
import {LabelInputType} from "../html/tinyComponents/LabelInputType.js";
import gameConfig from "../game/gameConfig.js";

export function populateSettingsElementFromConfig( fieldNames) {
    for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        if(el.type === 'checkbox'){
            el.checked =gameConfig[fieldName];
        }else{
            el.value = gameConfig[fieldName];
        }
    }
}

// uses type from the UI config
export function updateConfigFromUiElement( fieldNames) {
    for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        if (el.type === 'number') {
            gameConfig[fieldName] = Number(el.value);
        } else if (el.type === 'string') {
            gameConfig[fieldName] = String(el.value);
        } else if (el.type === 'checkbox') {
            gameConfig[fieldName] = el.checked;
        } else {
            gameConfig[fieldName] = el.value;
        }
    }
}

export function createSettingsComponent(labelInputs) {
    // if (document.getElementById('gameConfig')) return;

    const settingsElementForm = document.createElement("form");
    settingsElementForm.id = 'gameConfig';
    settingsElementForm.onsubmit = () => false;
    document.getElementById("main").appendChild(settingsElementForm);


    const h3 = document.createElement("h3");
    settingsElementForm.appendChild(h3);
    const icon = document.createElement("i");
    icon.classList.add('material-icons');
    icon.innerText = 'settings';
    h3.appendChild(icon);
    const span = document.createElement("span");
    span.innerText = 'Settings'
    h3.appendChild(span);

    for (const labelInput of labelInputs) {
        labelInput.createElementIn(settingsElementForm);
    }

    const submit = new ButtonType('submit', 'New Game', 'new-game');
    submit.createElementIn(settingsElementForm);
    //start collapsed
    settingsElementForm.classList.add('collapsed');

    document.addEventListener('click', (event) => {
        if (!settingsElementForm.classList.contains('collapsed')) {
            settingsElementForm.classList.add('collapsed');
        }
    });
    settingsElementForm.addEventListener('click', (event) => {
        event.stopPropagation();
        if (settingsElementForm.classList.contains('collapsed')) {
            settingsElementForm.classList.remove('collapsed');
        }
    });
}

createSettingsComponent([
    new LabelInputType('numRows', 'number', 'Rows'),
    new LabelInputType('numCols', 'number', 'Cols'),
    new LabelInputType('tileSize', 'number', 'Tile Size'),
    new LabelInputType('gameId', 'string', 'Game Id', null, 'auto', true),
    new LabelInputType('autoNewGame', 'checkbox', 'Auto New Game')
]);

// automatically start next game
document.addEventListener('game-won', () => {
    if (gameConfig.autoNewGame) {
        setTimeout(() => {
            document.dispatchEvent(new Event('new-game'));
        }, 500);
    }
});
