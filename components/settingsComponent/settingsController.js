'use strict';

function collapseSettingElement(event) {
    if (settingsExpanded) {
        const gameConfigEl = document.querySelector('.collapsible');
        settingsExpanded = false;
        if (!gameConfigEl.classList.contains('collapsed')) {
            gameConfigEl.classList.add('collapsed');
        }
    }
}

function expandSettingElement(event) {
    event.stopPropagation();
    if (!settingsExpanded) {
        const gameConfigEl = document.querySelector('.collapsible');
        settingsExpanded = true;
        if (gameConfigEl.classList.contains('collapsed')) {
            gameConfigEl.classList.remove('collapsed');
        }
    }
}

//assumes field in config matches DOM.id
function populateSettingsElementFromConfig(gameConfig, fieldNames) {
    for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        el.value = gameConfig[fieldName];
    }
}

// uses type from the UI config
function updateConfigFromUiElement(gameConfig, fieldNames) {
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

const gameConfigEl = document.getElementById('gameConfig');
document.addEventListener('click', collapseSettingElement);
gameConfigEl.addEventListener('click', expandSettingElement);

let settingsExpanded = true;

export {
    populateSettingsElementFromConfig,
    updateConfigFromUiElement
}
