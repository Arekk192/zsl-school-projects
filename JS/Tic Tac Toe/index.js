class Player {
  addEventListeners() {
    document.querySelectorAll(".field").forEach((field, index) => {
      field.addEventListener("click", (e) => {
        const classes = field.classList;
        const player = this.player;
        const move = this.move;
        if (["o", "x"].some((el) => classes.contains(el))) return;
        else if (player == move) {
          console.log(player, move);
          const moveDiv = document.createElement("div");
          moveDiv.className = `${player}-child`;

          e.target.append(moveDiv);
          e.target.classList.add(player);

          // sendData({ player: player, position: index });
        }
      });
    });
  }

  checkUpdates() {
    console.log("checking updates");
    setTimeout(() => this.checkUpdates(), 500);
  }

  init() {
    this.sendData({ init: true }, (res) => console.log(res));
    this.checkUpdates();
  }

  begin(player) {
    const date = Date.now();
    this.sendData({ player_start: player, date: date }, (res) => {
      this.date = date;
    });
  }

  sendData(data, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      callback(this.response);
    };
    xhttp.open("POST", "backend.php");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(data));
  }

  constructor() {
    this.move = "o";
    this.player = "";
    this.addEventListeners();
    this.init("x");
  }
}

let player;
const func = () => {
  player = new Player();
};
