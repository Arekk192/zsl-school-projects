interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
  color: string;
}

export default class SpriteSheet {
  readonly canvas: HTMLCanvasElement = document.querySelector(
    "#spritesheet_canvas"
  )!;
  readonly image: HTMLImageElement;
  public size: number;
  private fields: Array<Array<Field>> = [];
  private selectedFields: Array<Field> = [];
  private select: boolean = false;
  private selectStart: null | Field = null;

  private chosenFields: Array<Field> = [];
  private multiSelect: boolean = false;

  constructor(imageSrc: string, size = 48) {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d")!;
    const image = new Image();

    image.src = imageSrc;
    image.onload = () => ctx.drawImage(image, 0, 0);
    canvas.width = image.width;
    canvas.height = image.height;

    this.image = image;
    this.size = size;

    this.fields = this.getFields();

    this.addMouseDownEventListeners();
    this.addMouseMoveEventListeners();
    this.addMouseUpEventListeners();
  }

  getFields() {
    const canvas = this.canvas;
    const size = this.size;
    const width = canvas.width / size;
    const height = canvas.height / size;
    const fields: Array<Array<Field>> = [];

    for (let x = 0; x < width; x++) {
      const fieldsX: Array<Field> = [];
      for (let y = 0; y < height; y++) {
        const xPos = x * size + 1;
        const yPos = y * size + 1;
        fieldsX.push({
          x: x,
          y: y,
          xPos: xPos,
          yPos: yPos,
          color: "transparent",
        });
      }
      fields.push(fieldsX);
    }
    return fields;
  }

  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }

  // colorField(field: Field, color: string) {
  //   const size = this.size;
  //   const ctx = this.canvas.getContext("2d")!;
  //   ctx.fillStyle = color;
  //   ctx.fillRect(field.xPos, field.yPos, size - 1, size - 1);
  // }

  drawImage(field: Field, color?: string) {
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;

    const x = field.xPos;
    const y = field.yPos;

    if (color) {
      ctx.filter = "opacity(1)";
      ctx.drawImage(this.image, x, y, size, size, x, y, size, size);

      ctx.fillStyle = color;
      ctx.filter = "opacity(0.75)";
      ctx.fillRect(x, y, size, size);
    } else ctx.drawImage(this.image, x, y, size, size, x, y, size, size);
  }

  addMouseMoveEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const field = this.getField(e);
      this.selectedFields.forEach((f) => this.drawImage(f, "transparent"));
      this.chosenFields.forEach((f) => this.drawImage(f, "green"));
      this.selectedFields = [];

      if (!this.select) {
        this.drawImage(field, "orange");
        this.selectedFields.push(field);
      } else {
        const start = this.selectStart!;
        const fields = this.fields;

        // TODO solve bug:
        // if endpoint is lower than startpoint ( [5,3] and [2,1] )
        // the area will be null because of this for loop below

        for (let x = start.x; x <= field.x; x++) {
          for (let y = start.y; y <= field.y; y++) {
            this.selectedFields.push(fields[x][y]);
            this.drawImage(fields[x][y], "green");
          }
        }
        this.fields = fields;
      }
    });
  }

  addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (!this.multiSelect) {
        const chosenFields = this.chosenFields;
        if (chosenFields.length)
          chosenFields.forEach((f) => this.drawImage(f, f.color));

        this.chosenFields = [];
      }

      this.select = true;
      this.selectStart = this.getField(e);
    });
  }

  addMouseUpEventListeners() {
    this.canvas.addEventListener("mouseup", (e) => {
      const field = this.getField(e);
      const start = this.selectStart!;
      if (start.x == field.x && start!.y == field.y) {
        this.drawImage(field, "green");
        this.chosenFields.push(field);
      } else {
        const chosenFields = this.chosenFields;
        this.selectedFields.forEach((f) => chosenFields.push(f));
        this.chosenFields = chosenFields;
        this.selectedFields = [];
      }
      this.select = false;
    });
  }
}
