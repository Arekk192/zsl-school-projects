import BaseMap, { Field } from "./baseMap";

interface MapSize {
  width: number;
  height: number;
}

export default class Map extends BaseMap {
  /**
   * @param mapSize - Amount of fields, map is always a square
   * @param size - Size of a single field in px
   */
  private mapSize: MapSize;
  readonly canvas: HTMLCanvasElement = document.querySelector("#map_canvas")!;
  private multiSelect: boolean = false;

  constructor(mapSize: MapSize, size: number = 32) {
    super("map", size);

    this.mapSize = mapSize;
    this.canvas.width = mapSize.width * size;
    this.canvas.height = mapSize.height * size;

    this.generateFields();

    this.addMouseDownEventListeners();
    this.addMouseMoveEventListeners((field: Field, color: string) =>
      this.colorField(field, color)
    );
    this.addMouseUpEventListeners();
    this.addKeyDownEventListener();
    this.addKeyUpEventListener();
  }

  generateFields() {
    const ctx = this.canvas.getContext("2d")!;
    const fields: Array<Array<Field>> = [];
    const size = this.size;
    const mapSize = this.mapSize;
    ctx.fillStyle = "green";

    for (let x = 0; x < mapSize.width; x++) {
      const fieldsX: Array<Field> = [];
      for (let y = 0; y < mapSize.height; y++) {
        const xPos = x * size + 1;
        const yPos = y * size + 1;

        ctx.fillRect(xPos, yPos, size - 1, size - 1);
        fieldsX.push({
          x: x,
          y: y,
          xPos: xPos,
          yPos: yPos,
          color: "green",
        });
      }
      fields.push(fieldsX);
    }
    this.fields = fields;
  }

  colorField(field: Field, color: string) {
    const size = this.size;
    const ctx = this.canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(field.xPos, field.yPos, size - 1, size - 1);
  }

  addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (!this.multiSelect) {
        const chosenFields = this.chosenFields;
        if (chosenFields.length)
          chosenFields.forEach((f) => this.colorField(f, f.color));

        this.chosenFields = [];
      }

      this.select = true;
      this.selectStart = this.getField(e);
    });
  }

  addKeyDownEventListener() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const fields = this.fields;
        this.chosenFields.forEach((field) => {
          this.colorField(field, "salmon");
          fields[field.x][field.y].color = "salmon";
        });
        this.chosenFields = [];
        this.fields = fields;
      } else if (e.key === "Delete") {
        this.chosenFields.forEach((f) => this.colorField(f, f.color));
        this.chosenFields = [];
      } else if (e.key === "Control") {
        this.multiSelect = true;
      }
    });
  }

  addKeyUpEventListener() {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Control") this.multiSelect = false;
    });
  }
}
