'use strict';

export default {
    bindConfigToStorage
}

function bindConfigToStorage(configKey, configObject) {
    function loadConfigFromStorage() {
        if (!localStorage.getItem(configKey)) saveConfigToStorage();

        const savedConfig = JSON.parse(localStorage.getItem(configKey));
        for (const [key] of Object.entries(configObject)) {
            if (savedConfig[key] !== undefined && savedConfig[key] !== null) {
                configObject[key] = savedConfig[key];
            }
        }
    }

    function saveConfigToStorage() {
        localStorage.setItem(configKey, JSON.stringify(configObject));
    }

    function populateUiSettingsFromConfig() {
        for (const [key, value] of Object.entries(configObject)) {
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
        const formElement = document.getElementById(configKey);
        const formData = new FormData(formElement);
        for (const [key, value] of Object.entries(configObject)) {
            console.log(key, value, formData.get(key));
            if (formData.get(key) === null) continue;
            if (typeof (value) === 'number') {
                configObject[key] = Number(formData.get(key));
            } else if (typeof (value) === 'boolean') {
                configObject[key] = Boolean(formData.get(key));
            } else {
                configObject[key] = formData.get(key);
            }
        }
    }

    return {
        loadConfigFromStorage,
        saveConfigToStorage,
        populateUiSettingsFromConfig,
        readUiSettingsIntoConfig
    };
}

