const gameCreation = (function() {
    const startBtn = document.querySelector('#start');
    const grid = document.querySelector('#grid');
    const gridContainer = document.querySelector('#grid-container');
    const champion = new Audio('mixkit-retro-game-notification-212.wav');
    const placement = new Audio('mixkit-quick-jump-arcade-game-239.wav');
    const startGame = new Audio('mixkit-hard-click-1118.wav');

    function createGridCells() {
        for (i = 0; i < 9; i++) {
            let cell = document.createElement('div');
            cell.classList.add('grid-cells');
            let cellID = i + 1;
            cell.setAttribute('id', cellID);
            grid.appendChild(cell);
        }
        const gridCells = document.querySelectorAll('.grid-cells');
        gridCells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if ((gameBoard.area.length != 9) && (cell.innerText == "") && (gameFlow.determineWinner().winner == null)) {
                cell.innerText = gameFlow.playerTurn().marker;
                const cellNumber = Number(cell.id);
                gameFlow.addPosition(cellNumber);
                placement.play();

                console.log(player1.areaPosition, player2.areaPosition, gameBoard.area, gameFlow.determineWinner().winner);
                if (gameFlow.determineWinner().winner == 'player1') {
                    champion.play();
                    setTimeout(function () {
                        gameFlow.endGame().message.innerText = 'Player X Wins!';
                        gridCells.forEach((cell) => {
                            cell.innerText = "";
                        });
                    }, 1500);
                }
                else if (gameFlow.determineWinner().winner == 'player2') {
                    champion.play();
                    setTimeout(function () {
                        gameFlow.endGame().message.innerText = 'Player O Wins!';
                        gridCells.forEach((cell) => {
                            cell.innerText = "";
                        });
                    }, 1500);
                }
                else if (gameBoard.area.length == 9 && gameFlow.determineWinner().winner == null) {
                    champion.play();
                    setTimeout(function () {
                        gameFlow.endGame().message.innerText = `It's a Draw!`;
                        gridCells.forEach((cell) => {
                            cell.innerText = "";
                        });
                    }, 1500);
                }
                }
            });
        });
    }
    const gameBoard = {
        area: [],
    };
    const player = (playerNumber, marker) => {
        const playerName = playerNumber;
        const areaPosition = [];
        const declareWinner = () => 'You are the Winner!';
        return {playerName, marker, areaPosition, declareWinner};
    };
    const player1 = player('player1', 'X');
    const player2 = player('player2', 'o');
    const winningPositions = [
        {position: [1,2,3] },
        {position: [4,5,6] },
        {position: [7,8,9] },
        {position: [1,4,7] },
        {position: [2,5,8] },
        {position: [3,6,9] },
        {position: [1,5,9] },
        {position: [3,5,7] },
    ];
    const gameFlow = {
        playerTurn: function() {
            if (player1.areaPosition.length == player2.areaPosition.length) {
                return player1;
            }
            else if (player1.areaPosition.length > player2.areaPosition.length) {
                return player2;
            }
        },
        addPosition: function(cellID) {
            gameBoard.area.push(gameFlow.playerTurn().marker);
            gameFlow.playerTurn().areaPosition.push(cellID);
        },
        checkWin: function(arr1, arr2) {
            const indexArray = arr1.map(el => {
               return arr2.indexOf(el);
            });
            return indexArray.indexOf(-1) === -1;
        },
        determineWinner: function() {
            player1.areaPosition.sort((a,b) => a - b);
            player2.areaPosition.sort((a,b) => a - b);
            let p1 = player1.areaPosition;
            let p2 = player2.areaPosition;
            let winner;
            let check;
            if (gameFlow.playerTurn() != player1) {
                for (i = 0; i < winningPositions.length; i++) {
                    check = gameFlow.checkWin(winningPositions[i].position, p1);
                    if (check == true) {
                        winner = player1.playerName;
                        break;
                    }
                }
                return {winner};
            }
            else {
                for (i = 0; i < winningPositions.length; i++) {
                    check = gameFlow.checkWin(winningPositions[i].position, p2);
                    if (check == true) {
                        winner = player2.playerName;
                        break;
                    }
                }
                return {winner};
            }
        },
        endGame: function() {
            grid.setAttribute('style', 'display: none');
            const div = document.createElement('div');
            div.classList.add('endGame');

            const messageBlock = document.createElement('div');
            messageBlock.setAttribute('id', 'messageBlock');
            const message = document.createElement('h2');
            message.setAttribute('id', 'message');
            messageBlock.appendChild(message);

            const restartBtnBlock = document.createElement('div');
            restartBtnBlock.setAttribute('id', 'restartBtnBlock');
            const restartBtn = document.createElement('button');
            restartBtn.setAttribute('id', 'restartBtn');
            restartBtn.innerHTML = 'Restart';
            restartBtnBlock.appendChild(restartBtn);
            restartBtn.addEventListener('click', () => {
                startGame.play();
                setTimeout(function() {
                    gameFlow.newGame();
                    grid.setAttribute('style', 'display: grid');
                    div.remove();
                }, 500);
            });
            div.append(messageBlock, restartBtnBlock);
            gridContainer.appendChild(div);
            return {message};
        },
        newGame: function() {
            gameBoard.area = [];
            player1.areaPosition = [];
            player2.areaPosition = [];
        },
    };
    startBtn.addEventListener('click', () => {
        startGame.play();
        setTimeout(function() {
            startBtn.setAttribute('style', 'display: none');
            gridContainer.setAttribute('style', 'display: block');
            grid.setAttribute('style', 'display: grid');
            createGridCells();
        }, 500);
    });
    return {gameBoard, player1, player2};
})();