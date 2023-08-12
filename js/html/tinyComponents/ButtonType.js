'use strict';

import {onFunctionEvent, removeFunctionEvents} from "../../common/eventHandler.js";

export class ButtonType {
    elements = [];
    parentsElements = [];

    constructor(name, text, onclick, disabled, iconMdiText) {
        this.name = name;
        this.text = text;
        this.disabled = disabled;
        this.onclick = onclick;
        this.iconMdiText = iconMdiText
    }

    createElementIn(parentEl) {
        if (this.parentsElements.indexOf(parentEl) !== -1) {
            console.error('Already exists in this element', this);
        }

        const btnEl = document.createElement("button");
        btnEl.id = this.name;
        btnEl.name = this.name;
        if (this.disabled) btnEl.disabled = this.disabled;

        if (this.onclick) {
            if (typeof this.onclick === 'string') {
                btnEl.onclick = () => document.dispatchEvent(new Event(this.onclick));
            } else if (typeof this.onclick === 'function') {
                btnEl.onclick = this.onclick;
            } else {
                throw new Error('Unknown onclick type.');
            }
        }

        if (this.iconMdiText) {
            const i = document.createElement("i");
            i.classList.add('material-icons');
            i.innerText = 'undo';
            btnEl.appendChild(i);
        }

        if (this.text) {
            const span = document.createElement("span");
            span.innerText = this.text;
            btnEl.appendChild(span);
        }

        parentEl.appendChild(btnEl);
        this.elements.push(btnEl);
        console.log(this.elements);
        this.parentsElements.push(parentEl);
    }

    disableOnFunctionEvents(functionsArray) {
        for (const fn of functionsArray) {
            for (const el of this.elements) {
                onFunctionEvent(fn, this.name, () => el.disabled = true);
            }
        }
    }

    enableOnFunctionEvents(functionsArray) {
        for (const fn of functionsArray) {
            for (const el of this.elements) {
                onFunctionEvent(fn, this.name, () => el.disabled = false);
            }
        }
    }

    onFunctionEvent(fn, cb) {
        onFunctionEvent(fn, this.name, cb);
    }

    deleteEl(){
        for (const el of this.elements) {
            removeFunctionEvents(this.name);
            el.remove();
        }
    }
}
