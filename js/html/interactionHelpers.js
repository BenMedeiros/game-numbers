'use strict';

export function leftClickOrDrag(el, fn) {
    el.addEventListener('mousedown', (e) => {
        console.log('mouse down left', e.button, e.buttons);
        if (e.buttons === 1) {
            console.log('xx');
            fn();
        }
    });

    el.addEventListener('mouseenter', (e) => {
        console.log('mouse eneter', e.button, e.buttons);
        if (e.buttons === 1) fn();
    });
}

export function rightClickOrDrag(el, fn) {
    el.addEventListener('mousedown', (e) => {
        console.log('mouse down', e.button, e.buttons);
        if (e.buttons === 2) fn();
    });


    el.addEventListener('mouseenter', (e) => {
        console.log('mouse down', e.button, e.buttons);
        if (e.buttons === 2) fn();
    });

}