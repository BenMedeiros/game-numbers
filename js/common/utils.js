'use strict';

export  {
    randomInt,
    randomFrom,
    between,
    randomizeArray,
    roundToPrecisionString
}

//random from min to max inclusive
function randomInt(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFrom(enumList) {
    return enumList[randomInt(0, enumList.length - 1)];
}

function between(low, med, high) {
    return low < med && med < high;
}

function randomizeArray(arr) {
    return arr.sort((a, b) => 0.5 - Math.random());
}

function roundToPrecisionString(num, precision) {
    if (precision > 0) {
        const remainder = num - Math.floor(num);
        let remainderRounded = '.' + Math.round(remainder * Math.pow(10, precision));
        while(remainderRounded.length <= precision){
            remainderRounded += '0';
        }
        return Math.floor(num) + remainderRounded;
    } else if (precision === 0) {
        return Math.round(num) + '';
    }
}
