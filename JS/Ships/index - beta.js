const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
};

class Map {
  generateFields(size) {
    const map = document.createElement("div");
    const fields = [];
    map.className = "map";

    for (let i = 0; i < size.x; i++) {
      const row = document.createElement("div");
      const rowArray = [];

      for (let j = 0; j < size.y; j++) {
        const field = document.createElement("div");
        field.className = "field";
        rowArray.push({ x: i, y: j, element: field });
        row.append(field);
      }
      fields.push(rowArray);
      map.append(row);
    }

    document.getElementById("game").append(map);

    this.fields = fields;
    this.html = map;
  }

  addGameEventListeners() {
    const fields = this.fields,
      ships = this.shipFields;

    fields.forEach((row) => {
      for (let i = 0; i < this.size.y; i++) {
        const field = row[i];
        field.element.addEventListener("click", () => {
          const cl = field.element.classList; // classlist
          if (!(cl.contains("shooted-ship") || cl.contains("shooted-field"))) {
            let shooted = false;
            for (let j = 0; j < ships.length; j++)
              if (ships[j].x == field.x && ships[j].y == field.y)
                shooted = true;

            if (playerMove) {
              if (shooted) {
                fields[field.x][field.y].element.classList.add("shooted-ship");
                if (
                  document.getElementsByClassName("shooted-ship").length == 20
                )
                  endGame("win");
              } else
                fields[field.x][field.y].element.classList.add("shooted-field");
              playerMove = false;
              computerMakeMove();
            }
          }
        });
      }
    });
  }

  constructor(size) {
    this.size = size;
    this.fields = [];
    this.generateFields(this.size);
    this.disabledFields = [];
    this.shipFields = [];
  }
}

class PlayerMap extends Map {
  setShipSize(size) {
    this.shipSize = size;
  }

  changeShipRotation() {
    const rotation = this.shipRotation;
    if (rotation == "horizontal") this.shipRotation = "vertical";
    else this.shipRotation = "horizontal";

    const ind = this.currentFieldMousemove;
    this.fields[ind[0]][ind[1]].element.dispatchEvent(new Event("mousemove"));
  }

  removeEventListeners() {
    const fields = this.fields.map((el) => {
      const arr = [];
      for (let i = 0; i < this.size.y; i++)
        arr.push({ element: el[i].element.cloneNode(true), x: el.x, y: el.y });
      return arr;
    });
    this.fields = fields;
  }

  constructor(size) {
    super(size);
    this.shipRotation = "horizontal";
    this.shipSize = 4;
    this.currentFieldMousemove = null;
    this.currentShipStart = null;
    this.shipCanBePlaced = true;
    this.current = [];
    this.gameIsPlaying = false;

    const fields = this.fields;
    for (let i = 0; i < fields.length; i++) {
      for (let j = 0; j < fields[0].length; j++) {
        fields[i][j].element.addEventListener("mousemove", () => {
          if (this.shipSize) {
            const shipFields = this.shipFields;

            // to remove color from fields which are not ship
            for (let k = 0; k < size.x * size.y; k++) {
              const x = parseInt(k / 10),
                y = k % 10;
              if (shipFields.length == 0)
                fields[x][y].element.style.background = "none";
              else
                for (let l = 0; l < shipFields.length; l++)
                  if (!(shipFields[l].x == x && shipFields[l].y == y))
                    fields[x][y].element.style.background = "none";
            }

            // color ship fields
            this.shipFields.forEach((field) => {
              fields[field.x][field.y].element.style.background = "green";
            });

            // get current ship fields
            const fieldsToColor = [];
            const disabled = this.disabledFields;
            let col = true;
            if (this.shipRotation == "horizontal") {
              if (i > size.x - this.shipSize)
                for (let k = size.x - this.shipSize; k < fields.length; k++)
                  fieldsToColor.push(fields[k][j]);
              else
                for (let k = 0; k < this.shipSize; k++)
                  fieldsToColor.push(fields[i + k][j]);
            } else if (this.shipRotation == "vertical")
              if (j > size.y - this.shipSize)
                for (let k = size.y - this.shipSize; k < fields.length; k++)
                  fieldsToColor.push(fields[i][k]);
              else
                for (let k = 0; k < this.shipSize; k++)
                  fieldsToColor.push(fields[i][j + k]);

            fieldsToColor.forEach((el) => {
              for (let k = 0; k < disabled.length; k++)
                if (disabled[k].x == el.x && disabled[k].y == el.y) col = false;
            });

            // color current ship fields
            fieldsToColor.forEach((field) => {
              if (col) {
                field.element.style.background = "lightgreen";
                this.shipCanBePlaced = true;
              } else {
                field.element.style.background = "red";
                this.shipCanBePlaced = false;
              }
            });

            this.current = fieldsToColor;
            this.currentFieldMousemove = [i, j];
            this.currentShipStart = [fieldsToColor[0].x, fieldsToColor[0].y];
          }
        });
      }
    }

    this.html.addEventListener("click", () => {
      if (this.shipSize) {
        const ind = this.currentShipStart;
        const exist = ind != null && (ind[0] || ind[0] == 0);

        if (exist && this.shipCanBePlaced) {
          const ship = new Ship(
            { x: ind[0], y: ind[1] },
            this.shipSize,
            this.shipRotation,
            this
          );
          const activeShip = document.getElementById("active-ship");
          activeShip.classList.add("disabled-ship");
          activeShip.id = "";
          this.current.forEach((el) => (el.element.style.background = "green"));

          if (document.getElementsByClassName("disabled-ship").length == 10)
            startGame();
        } else {
          const fields = this.fields;
          const shipFields = this.shipFields;
          for (let i = 0; i < size.x * size.y; i++) {
            const x = parseInt(i / 10),
              y = i % 10;

            let colorGreen = false;
            const fieldIsRed = fields[x][y].element.style.background == "red";

            for (let j = 0; j < shipFields.length; j++)
              if (shipFields[j].x == x && shipFields[j].y == y && fieldIsRed)
                colorGreen = true;

            if (fieldIsRed) {
              if (colorGreen) fields[x][y].element.style.background = "green";
              else fields[x][y].element.style.background = "none";
            }
          }
          const el = document.getElementById("active-ship");
          if (el) el.id = "";
        }

        this.shipSize = 0;
        this.currentFieldMousemove = null;
        this.currentShipStart = null;
      }
    });

    this.html.addEventListener("mouseleave", () => {
      if (!this.gameIsPlaying) {
        const shipFields = this.shipFields;
        const fieldsToColor = [];
        for (let i = 0; i < size.x * size.y; i++) {
          for (let j = 0; j < shipFields.length; j++) {
            const x = parseInt(i / 10),
              y = i % 10;
            if (shipFields[j].x == x && shipFields[j].y == y)
              fieldsToColor.push(fields[x][y]);
          }
        }
        for (let i = 0; i < fields.length; i++)
          for (let j = 0; j < fields[0].length; j++)
            fields[i][j].element.style.background = "none";

        fieldsToColor.forEach((field) => {
          fields[field.x][field.y].element.style.background = "green";
        });
      }
    });
  }
}

class Ship {
  getFields(position, size, rotation) {
    const fields = [];
    if (rotation == "horizontal") {
      for (let i = 0; i < size; i++)
        fields.push({ x: position.x + i, y: position.y });
    } else if (rotation == "vertical") {
      for (let i = 0; i < size; i++)
        fields.push({ x: position.x, y: position.y + i });
    }
    return fields;
  }

  colorFields(fields, map) {
    fields.forEach((field) => {
      map.fields[field.x][field.y].element.style.background = "green";
    });
  }

  disableFields(fields, map) {
    for (let i = fields[0].x - 1; i <= fields[fields.length - 1].x + 1; i++) {
      for (let j = fields[0].y - 1; j <= fields[fields.length - 1].y + 1; j++) {
        if (i >= 0 && i < map.size.x && j >= 0 && j < map.size.y)
          map.disabledFields.push({ x: i, y: j });
      }
    }
  }

  /**
   * @param position should be { x: number, y: number } type, it is start position of a ship [0]
   * @param size is a number representing amount of fields used to describe a ship
   * @param rotation is enum "horizontal" or "vertical" representing ship's rotation
   * @param map is parent map object of type Map
   */
  constructor(position, size, rotation, map) {
    this.rotation = rotation;
    this.size = size;
    this.fields = this.getFields(position, size, rotation);

    // this.colorFields(this.fields, map);
    this.disableFields(this.fields, map);
    this.fields.forEach((field) => map.shipFields.push(field));
  }
}

const generateShip = (size, map) => {
  const fields = map.disabledFields;
  const rotation = Math.random() < 0.5 ? "horizontal" : "vertical";
  const x = getRandomIndex(10);
  const y = getRandomIndex(10);
  let canBeCreated = true;

  if (rotation == "horizontal") {
    for (let i = 0; i < fields.length; i++)
      for (let j = 0; j < size; j++)
        if (fields[i].x == x + j && fields[i].y == y) canBeCreated = false;
    if (x <= map.size.x - size && canBeCreated)
      return new Ship({ x: x, y: y }, size, rotation, map);
    else return generateShip(size, map);
  } else if (rotation == "vertical") {
    for (let i = 0; i < fields.length; i++)
      for (let j = 0; j < size; j++)
        if (fields[i].x == x && fields[i].y == y + j) canBeCreated = false;
    if (y <= map.size.y - size && canBeCreated)
      return new Ship({ x: x, y: y }, size, rotation, map);
    else return generateShip(size, map);
  }
};

const generateMap = () => {
  const map = new Map({ x: 10, y: 10 }, 40);
  const ships = [];
  for (let i = 4; i >= 1; i--)
    for (let j = i; j <= 4; j++) ships.push(generateShip(i, map));
  // console.log(ships);
  return map;
};

const generateShipsMenu = () => {
  for (let i = 4, top = 0; i >= 1; i--) {
    for (let j = i; j <= 4; j++) {
      const shipContainer = document.createElement("div");
      shipContainer.className = "ship-container";
      shipContainer.style.top = `${top}px`;
      top += 40;

      shipContainer.addEventListener("click", (e) => {
        for (const [_, value] of Object.entries(
          document.getElementsByClassName("ship-container")
        ))
          if (value.id == "active-ship") value.id = "";

        let ship;
        e.target.className == "ship-field"
          ? (ship = e.target.parentElement)
          : (ship = e.target);

        if (!ship.classList.contains("disabled-ship")) {
          ship.id = "active-ship";
          playerMap.setShipSize(ship.children.length);
        }
      });

      for (let k = 0; k < i; k++) {
        const field = document.createElement("div");
        field.className = "ship-field";
        shipContainer.append(field);
      }

      document.getElementById("ships-container").append(shipContainer);
    }
  }
  document.getElementsByClassName("ship-container").item(0).id = "active-ship";
};

// generateShipsMenu()

let playerMap; // = new PlayerMap({ x: 10, y: 10 });
let enemyMap; // = generateMap();

const contextMenuEvent = (e) => {
  e.preventDefault();
  playerMap.changeShipRotation();
};
// document.addEventListener("contextmenu", contextMenuEvent);

let playerMove; // = true;
// let currentShip = [];
// let currentRotation = null;
// let currentMoves = [];
let shootedShipsAmount; // = 0;
let shoots; // = [];

const restartGame = () => {
  document.body.innerHTML = `
    <div id="computer"></div>
      <div class="center">
        <div id="game">
          <div id="ships-container"></div>
        </div>
    </div>
  `;

  generateShipsMenu();
  playerMap = new PlayerMap({ x: 10, y: 10 });
  enemyMap = generateMap();

  shoots = [];
  shootedShipsAmount = 0;
  playerMove = true;

  document.addEventListener("contextmenu", contextMenuEvent);
};

const getRandomShot = () => {
  const x = getRandomIndex(10);
  const y = getRandomIndex(10);
  let arrayContainsShot = false;
  for (let i = 0; i < shoots.length; i++)
    if (shoots[i].x == x && shoots[i].y == y) arrayContainsShot = true;

  if (arrayContainsShot) return getRandomShot();
  else return { x: x, y: y };
};

const computerMakeMove = () => {
  document.getElementById("computer").textContent = "ruch komputera";

  const shoot = getRandomShot(),
    ships = playerMap.shipFields;
  shoots.push({ x: shoot.x, y: shoot.y });

  let shooted = false;
  for (let i = 0; i < ships.length; i++)
    if (ships[i].x == shoot.x && ships[i].y == shoot.y) shooted = true;

  if (shooted) {
    shootedShipsAmount += 1;
    playerMap.fields[shoot.x][shoot.y].element.style.background = "orange";
  } else playerMap.fields[shoot.x][shoot.y].element.style.background = "yellow";

  setTimeout(() => {
    if (shootedShipsAmount < 20) {
      document.getElementById("computer").textContent = "";
      playerMove = true;
    } else endGame("lose");
  }, 1000);
};

const startGame = () => {
  document.removeEventListener("contextmenu", contextMenuEvent);
  const shipsContainer = document.getElementById("ships-container");
  shipsContainer.style.opacity = 0;

  setTimeout(() => {
    playerMap.html.style.margin = "0 20px";
    shipsContainer.remove();
  }, 1000);

  playerMap.gameIsPlaying = true;
  // playerMap.removeEventListeners();
  enemyMap.addGameEventListeners();

  console.log("player: ", playerMap);
  console.log("enemy: ", enemyMap);
};

const endGame = (state) => {
  if (state == "win") {
    console.log("wygrales");
  } else if (state == "lose") {
    console.log("przegrales");
  }

  setTimeout(() => {}, 2500);
};

// restartGame();

// const computerMakeMove = () => {
//   document.getElementById("computer").textContent = "ruch komputera";

//   if (currentMoves[0]) {
//     console.log("if current moves 0", currentMoves[0]);

//     // logics if there is ship
//     const movesAmount = currentMoves.length;
//     const moveIndex = getRandomIndex(movesAmount);

//     const shoot = currentMoves[moveIndex],
//       ships = playerMap.shipFields;

//     shoots.push({ x: shoot.x, y: shoot.y });
//     let shooted = false;
//     for (let i = 0; i < ships.length; i++)
//       if (ships[i].x == shoot.x && ships[i].y == shoot.y) shooted = true;

//     if (shooted) {
//       currentShip.push({ x: shoot.x, y: shoot.y });

//       console.log(currentMoves, currentShip);

//       if (!currentRotation) {
//         const lastMove = currentShip[currentShip.length - 1];
//         if (lastMove.x == shoot.x) currentRotation = "horizontal";
//         else if (lastMove.y == shoot.y) currentRotation = "vertical";

//         if (currentRotation == "horizontal") {
//           currentMoves.filter((move) => {
//             let shouldBeRemoved = false;
//             for (let i = 0; i < currentMoves.length; i++)
//               if (move.y != shoot.y) shouldBeRemoved = true;
//             return !shouldBeRemoved;
//           });

//           if (shoot.x == 0) {
//             currentMoves.push({ x: 1, y: shoot.y });
//           } else if (shoot.x == 9) {
//             currentMoves.push({ x: 8, y: shoot.y });
//           } else {
//             currentMoves.push({ x: shoot.x - 1, y: shoot.y });
//             currentMoves.push({ x: shoot.x + 1, y: shoot.y });
//           }

//           // const
//           currentMoves = currentMoves.filter((move) => {
//             let shouldBeRemoved = false;
//             for (let i = 0; i < shoots.length; i++)
//               if (shoots[i].x == move.x && shoots[i].y == move.y)
//                 shouldBeRemoved = true;
//             return !shouldBeRemoved;
//           });

//           // TODO filter if these possible moves werent used in the past
//           // ( you have already shooted at that position once )

//           // TODO do the same for vertical case

//           // TODO zrob cos zeby to kurwa dzialalo
//         } else if (currentRotation == "vertical") {
//           currentMoves.filter((move) => {
//             let shouldBeRemoved = false;
//             for (let i = 0; i < currentMoves.length; i++)
//               if (move.x != shoot.x) shouldBeRemoved = true;
//             return !shouldBeRemoved;
//           });
//         }
//       } else if (currentShip.length == 4) {
//         currentRotation = null;
//         currentShip = [];
//         currentMoves = [];
//       }

//       playerMap.fields[shoot.x][shoot.y].element.style.background = "orange";
//     } else {
//       // find fields which you had shooted before
//       const toRemove = [];
//       for (let i = 0; i < shoots.length; i++)
//         for (let j = 0; j < currentMoves.length; j++)
//           if (
//             shoots[i].x == currentMoves[j].x &&
//             shoots[i].y == currentMoves[j].y
//           )
//             toRemove.push({ x: currentMoves[j].x, y: currentMoves[j].y });

//       // remove fields you had shooted before from array
//       currentMoves = currentMoves.filter((value) => {
//         let shouldBeRemoved = false;
//         for (let i = 0; i < toRemove.length; i++)
//           if (toRemove[i].x == value.x && toRemove[i].y == value.y)
//             shouldBeRemoved = true;
//         return !shouldBeRemoved;
//       });
//       playerMap.fields[shoot.x][shoot.y].element.style.background = "yellow";
//     }
//   } else {
//     const shoot = getRandomShot(),
//       ships = playerMap.shipFields;
//     shoots.push({ x: shoot.x, y: shoot.y });

//     let shooted = false;
//     for (let i = 0; i < ships.length; i++)
//       if (ships[i].x == shoot.x && ships[i].y == shoot.y) shooted = true;

//     if (shooted) {
//       currentShip.push({ x: shoot.x, y: shoot });
//       let possibleActions = [];

//       //#region cases
//       if (shoot.x == 9 && shoot.y == 9) {
//         possibleActions.push({ x: 8, y: 9 });
//         possibleActions.push({ x: 9, y: 8 });
//       } else if (shoot.x == 0 && shoot.y == 0) {
//         possibleActions.push({ x: 1, y: 0 });
//         possibleActions.push({ x: 0, y: 1 });
//       } else if (shoot.x == 9 && shoot.y == 0) {
//         possibleActions.push({ x: 8, y: 0 });
//         possibleActions.push({ x: 9, y: 1 });
//       } else if (shoot.x == 0 && shoot.y == 9) {
//         possibleActions.push({ x: 0, y: 8 });
//         possibleActions.push({ x: 1, y: 9 });
//       } else if (shoot.x == 0) {
//         possibleActions.push({ x: 0, y: shoot.y - 1 });
//         possibleActions.push({ x: 0, y: shoot.y + 1 });
//         possibleActions.push({ x: 1, y: shoot.y });
//       } else if (shoot.y == 0) {
//         possibleActions.push({ x: shoot.x - 1, y: 0 });
//         possibleActions.push({ x: shoot.x + 1, y: 0 });
//         possibleActions.push({ x: shoot.x, y: 1 });
//       } else if (shoot.x == 9) {
//         possibleActions.push({ x: 9, y: shoot.y - 1 });
//         possibleActions.push({ x: 9, y: shoot.y + 1 });
//         possibleActions.push({ x: 8, y: shoot.y });
//       } else if (shoot.y == 9) {
//         possibleActions.push({ x: shoot.x - 1, y: 9 });
//         possibleActions.push({ x: shoot.x + 1, y: 9 });
//         possibleActions.push({ x: shoot.x, y: 8 });
//       } else {
//         possibleActions.push({ x: shoot.x - 1, y: shoot.y });
//         possibleActions.push({ x: shoot.x + 1, y: shoot.y });
//         possibleActions.push({ x: shoot.x, y: shoot.y - 1 });
//         possibleActions.push({ x: shoot.x, y: shoot.y + 1 });
//       }
//       //#endregion

//       // find fields which you had shooted before
//       const toRemove = [];
//       for (let i = 0; i < shoots.length; i++)
//         for (let j = 0; j < possibleActions.length; j++)
//           if (
//             shoots[i].x == possibleActions[j].x &&
//             shoots[i].y == possibleActions[j].y
//           )
//             toRemove.push({ x: possibleActions[j].x, y: possibleActions[j].y });

//       // remove fields you had shooted before from array
//       possibleActions = possibleActions.filter((value) => {
//         let shouldBeRemoved = false;
//         for (let i = 0; i < toRemove.length; i++)
//           if (toRemove[i].x == value.x && toRemove[i].y == value.y)
//             shouldBeRemoved = true;
//         return !shouldBeRemoved;
//       });

//       console.log("\n\npossible actions:");
//       for (let i = 0; i < possibleActions.length; i++) {
//         console.log(
//           playerMap.fields[possibleActions[i].x][possibleActions[i].y].element
//         );
//       }

//       currentMoves = possibleActions;

//       playerMap.fields[shoot.x][shoot.y].element.style.background = "orange";
//     } else
//       playerMap.fields[shoot.x][shoot.y].element.style.background = "yellow";
//   }

//   setTimeout(() => {
//     document.getElementById("computer").textContent = "";
//     playerMove = true;
//   }, 1000);
// };
