function Game() {
  let rounds = 0;

  const GameBoard = (function () {
    return {
      0: [null, null, null],
      1: [null, null, null],
      2: [null, null, null],
    };
  })();

  const AddGameBoard = function () {
    return {
      leftCross: [GameBoard[0][0], GameBoard[1][1], GameBoard[2][2]],
      rightCross: [GameBoard[0][2], GameBoard[1][1], GameBoard[2][0]],
      up: GameBoard[0],
      down: GameBoard[2],
      right: [GameBoard[0][0], GameBoard[1][0], GameBoard[2][0]],
      left: [GameBoard[0][2], GameBoard[1][2], GameBoard[2][2]],
    };
  };

  const Human = (function () {
    const move = (obj) => {
      obj.part.style.background = `green`;
      GameBoard[obj.array[0]][obj.array[1]] = 1;
    }

    win();
    return { move };
  })();

  const Comp = (function () {
    function getRandomInt() {
      return Math.floor(Math.random() * 3);
    }

    const move = () => {
      const array = checkBoard([getRandomInt(), getRandomInt()]);
      GameBoard[array[0]][array[1]] = 0;
      const parts = document.querySelectorAll(`.unclicked`);
      for (let i = 0; i < parts.length; ++i) {
        const row = parseInt(parts[i].getAttribute(`data-row`));
        const column = parseInt(parts[i].getAttribute(`data-column`));
        console.log([row, column])
        if ([row, column].toString() == array.toString()) {
          parts[i].style.background = 'red';
        }
      }
      win();
    };

    return { move, getRandomInt };
  })();

  function checkBoard(array) {
    
    if (GameBoard[array[0]][array[1]] != null) {
      while (GameBoard[array[0]][array[1]] != null) {
        array = [Comp.getRandomInt(), Comp.getRandomInt()];
        console.log(array);
      }
    }

    return array;
  }

  const interaction = function () {
    const parts = document.querySelectorAll(`.unclicked`);

    for (let i = 0; i < parts.length; ++i) {
      parts[i].onclick = () => {
        const row = parseInt(parts[i].getAttribute(`data-row`));
        const column = parseInt(parts[i].getAttribute(`data-column`));

        parts[i].className = `part`;
        Human.move({array: [row, column], part: parts[i]});
        Comp.move();
        console.log(GameBoard);  
      }
    }
  };

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
    rounds++;
    console.log(GameBoard);
  }

  return { end, win, GameBoard, Human, interaction };
}

const DisplayGame = (function () {
  const DisplayStart = () => {
    const start = document.querySelector(`.start`);
    const wrapper = document.querySelector(`.wrapperButton`)

    start.onclick = () => {
      wrapper.style.width = `3rem`;
      wrapper.style.height = `2rem`;
      wrapper.style.background = `none`;
      wrapper.style.position = `static`;
      start.className = `reset`;
      const Game = window.Game();
      Game.interaction();
    }
  }

  const DisplayField = (function () {
    const field = document.querySelector(`.field`);

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        const newPart = document.createElement(`div`);
        newPart.className = `part unclicked`;
        newPart.setAttribute(`data-row`, `${i}`);
        newPart.setAttribute(`data-column`, `${j}`);

        field.appendChild(newPart);
      }
    }
  })();

  return { DisplayStart }
})();


DisplayGame.DisplayStart();