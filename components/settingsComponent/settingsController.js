'use strict';

import {SubmitType} from "../../js/html/tinyComponents/SubmitType.js";
import {LabelInputType} from "../../js/html/tinyComponents/LabelInputType.js";

export function populateSettingsElementFromConfig(gameConfig, fieldNames) {
    for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        el.value = gameConfig[fieldName];
    }
}

// uses type from the UI config
export function updateConfigFromUiElement(gameConfig, fieldNames) {
    for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        if (el.type === 'number') {
            gameConfig[fieldName] = Number(el.value);
        } else if (el.type === 'string') {
            gameConfig[fieldName] = String(el.value);
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

    const submit = new SubmitType('submit', 'New Game', 'new-game');
    submit.createElementIn(settingsElementForm);

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
    new LabelInputType('gameId', 'string', 'Game Id', null, 'auto', true)
]);