'use strict';

export class TextPageType {
    rootPageEl = null;

    constructor(name, title) {
        this.rootPageEl = document.createElement("div");
        this.rootPageEl.id = name;

        const textEl = document.createElement("h2");
        textEl.innerText = title;
        this.rootPageEl.appendChild(textEl);
    }

    h3(sectionTitle) {
        const h3 = document.createElement("h3");
        h3.innerText = sectionTitle;
        this.rootPageEl.appendChild(h3);
    }

    h4(sectionTitle) {
        const h4 = document.createElement("h4");
        h4.innerText = sectionTitle;
        this.rootPageEl.appendChild(h4);
    }

    p(text) {
        const p = document.createElement("p");
        p.innerHTML = text;
        this.rootPageEl.appendChild(p);
    }


    createElementIn(parentEl) {
        parentEl.appendChild(this.rootPageEl);
        return this.rootPageEl;
    }
}