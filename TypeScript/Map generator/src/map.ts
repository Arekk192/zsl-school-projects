interface MapSize {
  width: number;
  height: number;
}

interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
}

export default class Map {
  /**
   * @param mapSize - Amount of fields, map is always a square
   * @param size - Size of a single field in px
   */
  mapSize: MapSize;
  size: number;
  readonly canvas: HTMLCanvasElement = document.querySelector("#game_canvas")!;
  private fields: Array<Array<Field>> = [];
  private selectedFields: Array<Field> = [];
  private lastColoredElement: null | Field = null;
  private multiselect: boolean = false;
  private multiselectStart: null | Field = null;

  constructor(mapSize: MapSize, size: number = 32) {
    this.mapSize = mapSize;
    this.size = size;
    this.canvas.width = mapSize.width * size;
    this.canvas.height = mapSize.height * size;

    this.generateFields();
    this.addMouseDownEventListeners();
    this.addMouseMoveEventListeners();
    this.addMouseUpEventListeners();
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
        fieldsX.push({ x: x, y: y, xPos: xPos, yPos: yPos });
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

  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }

  addMouseMoveEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      if (e.target instanceof HTMLElement && !this.multiselect) {
        // TODO selectedFields and lastColoredElement conflict
        const el = this.lastColoredElement;
        if (el) this.colorField(el, "green");

        const field = this.getField(e);
        this.colorField(field, "blue");
        this.lastColoredElement = field;
      } else {
        const start = this.multiselectStart!;
        const end = this.getField(e);
        const fields = this.fields;

        this.selectedFields.forEach((field) => this.colorField(field, "green"));
        for (let x = start.x; x <= end.x; x++) {
          for (let y = start.y; y <= end.y; y++) {
            this.selectedFields.push(fields[x][y]);
            this.colorField(fields[x][y], "orange");
          }
        }
      }
    });
  }

  addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.multiselect = true;
      this.multiselectStart = this.getField(e);
    });
  }

  addMouseUpEventListeners() {
    this.canvas.addEventListener("mouseup", (e) => {
      const start = this.multiselectStart!;
      const end = this.getField(e);
      const fields = this.fields;

      for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
          this.selectedFields.push(fields[x][y]);
          this.colorField(fields[x][y], "orange");
        }
      }
      this.multiselect = false;
      this.selectedFields = [];
    });
  }
}
