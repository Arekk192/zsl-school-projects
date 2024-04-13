interface MapSize {
  width: number;
  height: number;
}

interface Field {
  x: number;
  y: number;
}

export default class Map {
  mapSize: MapSize;
  size: number;
  canvas: HTMLCanvasElement;
  fields: Array<Array<Field>>;

  lastColoredElement: null | Field;

  constructor(mapSize: MapSize, size: number) {
    this.mapSize = mapSize;
    this.size = size;
    this.fields = [];
    this.lastColoredElement = null;

    const canvas: HTMLCanvasElement = document.querySelector("#game_canvas")!;
    canvas.width = mapSize.width * size;
    canvas.height = mapSize.height * size;
    this.canvas = canvas;

    this.generateFields();
    this.addClickEventListeners();
    this.addMouseDownEventListeners();
  }

  generateFields() {
    const mapSize = this.mapSize;
    const fieldSize = this.size;

    const ctx = this.canvas.getContext("2d")!;
    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";

    const fields: Array<Array<Field>> = [];

    for (let x = 0; x < mapSize.width; x++) {
      const fieldsX: Array<Field> = [];
      for (let y = 0; y < mapSize.height; y++) {
        ctx.rect(x, y, fieldSize, fieldSize);

        const xPos = x * fieldSize;
        const yPos = y * fieldSize;

        ctx.fillRect(1 + xPos, 1 + yPos, fieldSize - 1, fieldSize - 1);
        fieldsX.push({ x: xPos, y: yPos });
      }
      fields.push(fieldsX);
    }
    this.fields = fields;
  }

  addClickEventListeners() {
    this.canvas.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement) {
        const rect = e.target.getBoundingClientRect();

        const x = Math.floor((e.clientX - rect.x) / this.size);
        const y = Math.floor((e.clientY - rect.y) / this.size);

        console.log(x, y);

        const field = this.fields[x][y];
      }
    });
  }

  addMouseDownEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      if (e.target instanceof HTMLElement) {
        const ctx = this.canvas.getContext("2d")!;

        const rect = e.target.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.x) / this.size);
        const y = Math.floor((e.clientY - rect.y) / this.size);
        const size = this.size;
        const field = this.fields[x][y];

        const el = this.lastColoredElement;
        ctx.fillStyle = "green";
        if (el) ctx.fillRect(el.x + 1, el.y + 1, size - 1, size - 1);

        ctx.fillStyle = "blue";
        ctx.fillRect(field.x + 1, field.y + 1, size - 1, size - 1);
        this.lastColoredElement = field;
      }
    });
  }
}

// TODO color rect if clicked
