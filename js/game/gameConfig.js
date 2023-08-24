'use strict';

import {randomInt} from "../common/utils.js";

const gameConfig = {
    numCols: 4,
    numRows: 5,
    tileSize: 3,
    //gameId is a int[] so that any number of tiles can be supported
    gameIdPartitioned: [],
    autoNewGame: false
};

Object.assign(gameConfig, JSON.parse(localStorage.getItem('gameConfig')));

Object.defineProperties(gameConfig, {
    gameId: {
        enumerable: false,
        get() {
            return this.gameIdPartitioned.join('-');
        },
        set(gameId) {
            this.gameIdPartitioned.length = 0;
            //each byte/int supports 30 tiles, so remove gameId excess since it'll never be used
            const lengthRequired = Math.ceil(this.numCols * this.numRows / 30);
            const maxLengthInLastPartition = ((this.numCols * this.numRows) - 1) % 30;

            const strArray = String(gameId).split('-');
            for (const str of strArray) {
                //10 char numbers is roughly what int32 can hold
                for (let i = 0; i < str.length; i += 10) {
                    this.gameIdPartitioned.push(parseInt(str.substr(i, i + 10)));
                }
            }

            //if this is more than needed to describe the square, truncate
            if (this.gameIdPartitioned.length > lengthRequired) {
                this.gameIdPartitioned.length = lengthRequired;
            }
            //if there are not enough partitions create some randoms
            while (this.gameIdPartitioned.length < lengthRequired) {
                this.gameIdPartitioned.push(randomInt(0, 1 << 30));
            }

            //only need this many tiles/bits in the last partition
            this.gameIdPartitioned[this.gameIdPartitioned.length - 1] %= (1 << maxLengthInLastPartition);
        }
    }
});

console.log(gameConfig);
export default gameConfig;