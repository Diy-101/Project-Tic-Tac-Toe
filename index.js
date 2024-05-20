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
      middle: GameBoard[1],
      middleline: [GameBoard[0][1], GameBoard[1][1], GameBoard[2][1]],
      right: [GameBoard[0][0], GameBoard[1][0], GameBoard[2][0]],
      left: [GameBoard[0][2], GameBoard[1][2], GameBoard[2][2]],
    };
  };

  const putSvg = (path, node) => {
    fetch(`${path}`)
        .then((response) => response.text())
        .then((data) => {
          // Вставляем SVG в DOM
          node.innerHTML += data;
        })
        .catch((error) => console.error("Ошибка загрузки SVG:", error));
  }

  const putAngles = (node, {i, j}) => {
    if (i === 0 && j === 0) {
      node.style.borderBottom = "5px solid black"
      node.style.borderRight = "5px solid black"
    } else if (i === 0 && j === 2) {
      node.style.borderBottom = "5px solid black"
      node.style.borderLeft = "5px solid black"
    } else if (i === 0 && j === 1) {
      node.style.borderBottom = "5px solid black";
    } else if (i === 1 && j === 0) {
      node.style.borderRight = "5px solid black";
    } else if (i === 1 && j === 2) {
      node.style.borderLeft = "5px solid black";
    } else if (i === 2 && j === 1) {
      node.style.borderTop = "5px solid black";
    } else if (i === 2 && j === 0) {
      node.style.borderTop = "5px solid black"
      node.style.borderRight = "5px solid black"
    } else if (i === 2 && j === 2) {
      node.style.borderTop = "5px solid black"
      node.style.borderLeft = "5px solid black"
    }
  }

  const Human = (function () {
    const move = (obj) => {
      fetch("/svg/cross-svgrepo-com(3).svg")
        .then((response) => response.text())
        .then((data) => {
          // Вставляем SVG в DOM
          obj.part.innerHTML += data;
        })
        .catch((error) => console.error("Ошибка загрузки SVG:", error));
      obj.part.onclick = () => {
        return;
      };
      GameBoard[obj.array[0]][obj.array[1]] = 1;
    };
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
        if ([row, column].toString() == array.toString()) {
          fetch("/svg/circle-svgrepo-com.svg")
            .then((response) => response.text())
            .then((data) => {
              // Вставляем SVG в DOM
              parts[i].innerHTML += data;
            })
            .catch((error) => console.error("Ошибка загрузки SVG:", error));

          parts[i].onclick = () => {
            return;
          };
        }
      }
    };

    return { move, getRandomInt };
  })();

  function checkBoard(array) {
    const fullBoard = GameBoard[0].concat(GameBoard[1], GameBoard[2]);
    const newArray = fullBoard.filter((element) => element === null);
    if (newArray.length === 0) {
      return;
    } else if (GameBoard[array[0]][array[1]] != null) {
      while (GameBoard[array[0]][array[1]] != null) {
        array = [Comp.getRandomInt(), Comp.getRandomInt()];
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
        Human.move({ array: [row, column], part: parts[i] });
        if (win()) return;
        window.setTimeout(Comp.move, 300);
        // win();
      };
    }

    return;
  };

  function win() {
    const Board = AddGameBoard();
    for (let part in Board) {
      if (Board[part].join(``) === `111`) {
        end(1);
        return true;
      } else if (Board[part].join(``) === `000`) {
        end(0);
        return true;
      } else if (
        GameBoard[0]
          .concat(GameBoard[1], GameBoard[2])
          .filter((element) => element === null).length === 0 &&
        Board.left === Board[part]
      ) {
        end();
        return true;
      }
    }
  }

  function end(winner) {
    const reset = document.querySelector(`.reset`);
    const wrapperReset = document.querySelector(`.wrapperButton`);

    wrapperReset.onclick = () => {
      const GameVarible = Game();
      GameVarible.displayField();
      GameVarible.interaction();
      wrapperReset.style.display = `none`;
      reset.removeChild(reset.firstElementChild);
    };

    if (winner === 1) {
      wrapperReset.style.display = `flex`;
      putSvg("/svg/cross-svgrepo-com(3).svg", reset);
      return;
    } else if (winner === 0) {
      wrapperReset.style.display = `flex`;
      putSvg("/svg/circle-svgrepo-com.svg", reset);
      return;
    } else {
      wrapperReset.style.display = `flex`;
      reset.textContent = `Draw`;
      reset.style.color = `white`;
      reset.style.fontSize = `5rem`; 
      return;
    }
  }

  function displayField() {
    const field = document.querySelector(`.field`);
    field.innerHTML = ``;
  
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        const newPart = document.createElement(`div`);
        newPart.className = `part unclicked`;
        newPart.setAttribute(`data-row`, `${i}`);
        newPart.setAttribute(`data-column`, `${j}`);
  
        putAngles(newPart, {i: i, j: j});

        field.appendChild(newPart);
      }
    }
  }

  return { interaction, displayField };
}


const GameVarible = Game();
GameVarible.displayField();
GameVarible.interaction();
