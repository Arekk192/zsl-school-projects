class Map {
  generate(size) {
    const map = document.createElement("div");
    map.id = "map";
    for (let i = 0; i < size; i++) {
      const col = document.createElement("div");
      for (let j = 0; j < size; j++) {
        const field = document.createElement("div");
        field.className = "field";
        col.append(field);
      }
      map.append(col);
    }
    document.body.append(map);
    return map;
  }

  addListeners() {
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowRight":
          this.direction = "right";
          this.playerPosX += 1;
          this.html.children[this.playerPosX + 1].children[
            this.playerPosY
          ].style.background = "green";
          break;
        case "ArrowUp":
          this.direction = "up";
          this.playerPosY -= 1;
          this.html.children[this.playerPosX].children[
            this.playerPosY - 1
          ].style.background = "green";
          break;
        case "ArrowLeft":
          this.direction = "left";
          this.playerPosX -= 1;
          this.html.children[this.playerPosX - 1].children[
            this.playerPosY
          ].style.background = "green";
          break;
        case "ArrowDown":
          this.direction = "down";
          this.playerPosY += 1;

          this.html.children[this.playerPosX].children[
            this.playerPosY + 1
          ].style.background = "green";
          break;
      }
    });
  }

  constructor(size) {
    // this.size = size
    this.size = 9;
    this.html = this.generate(this.size);
    this.playerPosX = parseInt(this.size / 2);
    this.playerPosY = parseInt(this.size / 2);
    this.direction = "";

    this.html.children[this.playerPosX].children[
      this.playerPosY
    ].style.background = "green";

    this.addListeners();
  }
}

const map = new Map(19);
