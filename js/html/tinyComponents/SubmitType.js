'use strict';

export class SubmitType {
    parentsElements = [];

    constructor(name, value, onclickString, disabled) {
        this.name = name;
        this.value = value;
        this.disabled = disabled;
        this.onclickString = onclickString;
    }

    createElementIn(parentEl) {
        if (this.parentsElements.indexOf(parentEl) !== -1) {
            console.error('Already exists in this element', this);
        }

        const inputEl = document.createElement("button");
        inputEl.id = this.onclickString;
        inputEl.name = this.onclickString;
        inputEl.innerText = this.value;
        // inputEl.type = 'submit';
        if (this.disabled) inputEl.disabled = this.disabled;
        if (this.onclickString) inputEl.onclick = () => document.dispatchEvent(new Event(this.onclickString));

        parentEl.appendChild(inputEl);
        this.parentsElements.push(parentEl);
    }
}
