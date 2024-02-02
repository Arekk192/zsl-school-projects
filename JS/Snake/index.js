const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
};

class Map {
  generate(size) {
    const fields = [];
    const map = document.createElement("div");
    map.id = "map";
    for (let i = 0; i < size; i++) {
      const col = document.createElement("div");
      const xFields = [];
      for (let j = 0; j < size; j++) {
        const field = document.createElement("div");
        field.className = "field";
        col.append(field);
        xFields.push(field);
      }
      map.append(col);
      fields.push(xFields);
    }
    document.body.append(map);
    this.fields = fields;
    return map;
  }

  addListeners() {
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      if (e.key == "ArrowRight" && this.direction != "left")
        this.direction = "right";
      else if (e.key == "ArrowUp" && this.direction != "down")
        this.direction = "up";
      else if (e.key == "ArrowLeft" && this.direction != "right")
        this.direction = "left";
      else if (e.key == "ArrowDown" && this.direction != "up")
        this.direction = "down";
    });
  }

  move() {
    const direction = this.direction;
    const snake = this.snake;
    const head = snake[0];
    const tail = snake[snake.length - 1];
    const map = this.fields;

    let touched = false;
    snake.forEach((el, i) => {
      if (i != 0 && el.x == head.x && el.y == head.y) touched = true;
    });

    const ms = this.size;
    if (
      (head.x == 0 && direction == "left") ||
      (head.x >= ms - 1 && direction == "right") ||
      (head.y <= 0 && direction == "up") ||
      (head.y >= ms - 1 && direction == "down") ||
      touched
    ) {
      setTimeout(() => {
        this.direction = "";
        for (let x = 0; x < this.size; x++)
          for (let y = 0; y < this.size; y++)
            if (map[x][y].style.backgroundPosition != "0px 50px") {
              map[x][y].style.transition = "1.25s";
              map[x][y].style.filter = "hue-rotate(260deg)";
            }
      }, 5);
    } else {
      if (this.direction)
        // clear map
        map.forEach((x) => x.forEach((y) => (y.style.backgroundPosition = "")));

      const apple = this.apple; // check if apple was eaten
      if (head.x == apple.x && head.y == apple.y) {
        this.apple = {};
        this.generateApple();
        this.snake.push({ x: tail.x, y: tail.y });
      }

      if (apple.x && apple.y)
        map[apple.x][apple.y].style.backgroundPosition = "0 50px";
      else this.generateApple();

      // move snake
      for (let i = this.snake.length - 1; i >= 1; i--)
        if (this.snake[i]) {
          this.snake[i].x = this.snake[i - 1].x;
          this.snake[i].y = this.snake[i - 1].y;
        }
      if (direction == "up") this.snake[0].y -= 1;
      else if (direction == "right") this.snake[0].x += 1;
      else if (direction == "down") this.snake[0].y += 1;
      else if (direction == "left") this.snake[0].x -= 1;

      for (let i = 0; i < snake.length; i++) {
        // color snake
        const curr = snake[i];
        let pos = "";
        if (i == 0) {
          if (direction == "up") pos = "100px 0";
          else if (direction == "right") pos = "50px 0";
          else if (direction == "down") pos = "50px -50px";
          else if (direction == "left") pos = "100px -50px";
        } else if (i == snake.length - 1) {
          const cell = snake[i - 1];
          if (cell.x == curr.x && cell.y + 1 == curr.y) pos = "100px 100px";
          else if (cell.x + 1 == curr.x && cell.y == curr.y) pos = "100px 50px";
          else if (cell.x == curr.x && cell.y - 1 == curr.y) pos = "50px 50px";
          else if (cell.x - 1 == curr.x && cell.y == curr.y) pos = "50px 100px";
        } else {
          const prev = snake[i - 1];
          const next = snake[i + 1];
          if (
            ((curr.x == prev.x - 1 && curr.x == next.x + 1) ||
              (curr.x == prev.x + 1 && curr.x == next.x - 1)) &&
            prev.y == curr.y && next.y == curr.y
          ) pos = "-50px 0"; // horizontal
          else if (
            ((curr.y == prev.y - 1 && curr.y == next.y + 1) ||
              (curr.y == prev.y + 1 && curr.y == next.y - 1)) &&
            prev.x == curr.x && next.x == curr.x
          ) pos = "150px -50px"; //vertical
          else if (
            (prev.x == curr.x && prev.y - 1 == curr.y && next.x - 1 == curr.x && next.y == curr.y) ||
            (prev.x - 1 == curr.x && prev.y == curr.y && next.x == curr.x && next.y - 1 == curr.y)
          ) pos = "0 0"; // top left
          else if (
            (prev.x == curr.x && prev.y + 1 == curr.y && next.x - 1 == curr.x && next.y == curr.y) ||
            (prev.x - 1 == curr.x && prev.y == curr.y && next.x == curr.x && next.y + 1 == curr.y)
          ) pos = "0 -50px"; // bottom left
          else if (
            (prev.x == curr.x && prev.y + 1 == curr.y && next.y == curr.y && next.x + 1 == curr.x) ||
            (prev.x + 1 == curr.x && prev.y == curr.y && next.y + 1 == curr.y && next.x == curr.x)
          ) pos = "-100px -100px"; // bottom right
          else if (
            (prev.x == curr.x && prev.y - 1 == curr.y && next.x + 1 == curr.x && next.y == curr.y) ||
            (prev.x + 1 == curr.x && prev.y == curr.y && next.x == curr.x && next.y - 1 == curr.y)
          ) pos = "-100px 0"; // top right
        }

        if (map[curr.x] && map[curr.x][curr.y])
          map[curr.x][curr.y].style.backgroundPosition = pos;
      }
      setTimeout(() => this.move(), 150);
    }
  }

  generateApple() {
    const x = getRandomIndex(this.size);
    const y = getRandomIndex(this.size);
    const snake = this.snake;
    let isSnake = false;
    for (let i = 0; i < snake.length; i++)
      if (snake[i].x == x && snake[i].y == y) isSnake = true;

    if (isSnake) this.generateApple();
    else this.apple = { x: x, y: y };
  }

  constructor(size) {
    this.size = size;
    this.fields = [];
    this.html = this.generate(this.size);
    this.apple = {};
    this.direction = "";
    this.snake = [{ x: parseInt(this.size / 2), y: parseInt(this.size / 2) }];
    this.alive = true;
    this.addListeners();
    this.move();
  }
}
