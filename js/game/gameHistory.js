'use strict';

const history = JSON.parse(localStorage.getItem('history')) || [];

function saveCompletedGame(gameConfig, gameData) {
    if(history.length > 1000) console.warn('Review history truncation');

    history.push({
        numCols: gameConfig.numCols,
        numRows: gameConfig.numRows,
        gameId: gameConfig.gameId,
        startTime: gameData.startTime,
        timeElapsed: gameData.timeElapsed
    });

    localStorage.setItem('history', JSON.stringify(history));

    console.log(history);
}

function getBestTimeForSize(gameConfig){
    let bestTime = Infinity;
    for (const hist of history) {
        if(hist.numCols === gameConfig.numCols && hist.numRows === gameConfig.numRows){
            if(hist.timeElapsed < bestTime) bestTime = hist.timeElapsed;
        }
    }

    return bestTime;
}

export {
    saveCompletedGame,
    getBestTimeForSize
}
