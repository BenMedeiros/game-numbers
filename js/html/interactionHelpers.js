'use strict';

export function leftClickOrDrag(el, fn) {
    el.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) fn();
    });

    el.addEventListener('mouseenter', (e) => {
        if (e.buttons === 1) fn();
    });
}

export function rightClickOrDrag(el, fn) {
    el.addEventListener('mousedown', (e) => {
        if (e.buttons === 2) fn();
    });


    el.addEventListener('mouseenter', (e) => {
        if (e.buttons === 2) fn();
    });
}

export function onTouchLongPress(el, touchTime = 1000, fn) {
    let timeoutId = 0;
    el.addEventListener('touchstart', (e) => {
        timeoutId = setTimeout(fn, touchTime);
    });
    el.addEventListener('touchend', (e) => {
        clearTimeout(timeoutId);
    });
    el.addEventListener('touchcancel', (e) => {
        clearTimeout(timeoutId);
    });
}