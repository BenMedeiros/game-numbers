'use strict';

export class LabelInputType {
    parentsElements = [];

    constructor(name, type, labelText, value, placeholder, readOnly) {
        this.name = name;
        this.type = type;
        this.labelText = labelText;
        this.value = value;
        this.placeholder = placeholder;
        this.readOnly = readOnly;
    }

    createElementIn(parentEl) {
        if (this.parentsElements.indexOf(parentEl) !== -1) {
            console.error('Already exists in this element', this);
        }

        const divEl = document.createElement("div");

        const labelEl = document.createElement("label");
        labelEl.htmlFor = this.name;
        labelEl.innerText = this.labelText;
        divEl.appendChild(labelEl);

        const inputEl = document.createElement("input");
        inputEl.type = this.type;
        inputEl.id = this.name;
        inputEl.name = this.name;
        if (this.value !== undefined) inputEl.value = this.value;
        if (this.placeholder !== undefined) inputEl.placeholder = this.placeholder;
        if (this.readOnly) inputEl.readOnly = true;
        divEl.appendChild(inputEl);

        parentEl.appendChild(divEl);
        this.parentsElements.push(parentEl);
    }
}
