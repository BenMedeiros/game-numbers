'use strict';

const history = JSON.parse(localStorage.getItem('history')) || [];

function saveCompletedGame(gameConfig, gameData) {
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

export {
    saveCompletedGame
}
