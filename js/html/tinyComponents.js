'use strict';

export function appendLabelAndInput(parentEl, name, labelText, value){
    const divEl = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = name;
    labelEl.innerText = labelText;
    divEl.appendChild(labelEl);

    const inputEl = document.createElement("input");
    inputEl.type = typeof value;
    inputEl.id = name;
    inputEl.name = name;
    inputEl.value = value;
    inputEl.readOnly = true;
    divEl.appendChild(inputEl);

    parentEl.appendChild(divEl);
}