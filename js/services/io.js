'use strict';

function loadConfigFromStorage() {
    if (!localStorage.getItem('gameConfig')) saveConfigToStorage();

    const savedConfig = JSON.parse(localStorage.getItem('gameConfig'));
    for (const [key] of Object.entries(gameConfig)) {
        if (savedConfig[key] !== undefined && savedConfig[key] !== null) {
            gameConfig[key] = savedConfig[key];
        }
    }
}

function saveConfigToStorage() {
    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
}

function populateUiSettingsFromConfig() {
    for (const [key, value] of Object.entries(gameConfig)) {
        const configElement = document.getElementById(key);
        if (configElement) {
            if (configElement.type === 'checkbox') {
                configElement.toggleAttribute('checked', Boolean(value));
            } else {
                configElement.value = value;
            }
        }
    }
}

function readUiSettingsIntoConfig() {
    const formElement = document.getElementById('gameConfig');
    const formData = new FormData(formElement);
    for (const [key, value] of Object.entries(gameConfig)) {
        console.log(key, value, formData.get(key));
        if (formData.get(key) === null) continue;
        if (typeof (value) === 'number') {
            gameConfig[key] = Number(formData.get(key));
        } else if (typeof (value) === 'boolean') {
            gameConfig[key] = Boolean(formData.get(key));
        } else {
            gameConfig[key] = formData.get(key);
        }
    }
}
