


const Game = (function () {
    let rounds = 0;

    const GameBoard = (function () {
        return {
            0: [null, null, null],
            1: [null, null, null],
            2: [null, null, null],
        }
    })();

    const AddGameBoard = function() {
        return {
            leftCross: [GameBoard[0][0], GameBoard[1][1], GameBoard[2][2]],
            rightCross: [GameBoard[0][2], GameBoard[1][1], GameBoard[2][0]],
            up: GameBoard[0],
            down: GameBoard[2],
            right: [GameBoard[0][0], GameBoard[1][0], GameBoard[2][0]],
            left: [GameBoard[0][2], GameBoard[1][2], GameBoard[2][2]],
        }
    }

    function Player () {
        return {
            score: 0,
        };    
    };

    const Human = (function () {
        const { score } = Player();

        const move = () => prompt().split(``).map((n) => parseInt(n));

        return {score, move}
    })();

    const Comp = (function () {
        const { score } = Player();

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        const move = () => {
            return [getRandomInt(3), getRandomInt(3)];
        }

        return {score, move}
    })();

    function checkBoard(array, obj) {
        if (GameBoard[array[0]][array[1]] != null) {
            while (GameBoard[array[0]][array[1]] != null) {
                array = obj.move();
            }
        }

        return array;
    }

    function playRound() {
        let humanMove = Human.move();
        humanMove = checkBoard(humanMove, Human);
        GameBoard[humanMove[0]][humanMove[1]] = 1;

        let compMove = Comp.move();
        compMove = checkBoard(compMove, Comp);
        GameBoard[compMove[0]][compMove[1]] = 0;
    }

    function win() {
        const Board = AddGameBoard();
        for (let part in Board) {
            if (Board[part].join(``) === `000`) {
                console.log(`Comp has won`);
            } else if (Board[part].join(``) === `111`) {
                console.log(`You have won`);
            }
        }
    }

    function end() {
        rounds++
        console.log(GameBoard);
    }

    return { playRound, end, win, AddGameBoard }
})();

while (true) {
    Game.playRound();
    Game.win();
    Game.end();
}

