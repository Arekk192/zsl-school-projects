import BaseMap, { Field } from "./baseMap";

export default class SpriteSheet extends BaseMap {
  private readonly image: HTMLImageElement;
  constructor(imageSrc: string, size = 48) {
    super("spritesheet", size);

    const image = new Image();

    image.src = imageSrc;
    image.onload = () => this.canvas.getContext("2d")!.drawImage(image, 0, 0);

    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.image = image;
    this.fields = this.getFields();

    this.addMouseDownEventListeners();
    this.addMouseMoveEventListeners((field: Field, backgroundColor: string) =>
      this.drawImage(field, backgroundColor)
    );
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

  drawImage(field: Field, backgroundColor: string) {
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;
    const x = field.xPos;
    const y = field.yPos;

    ctx.filter = "opacity(1)";
    ctx.drawImage(this.image, x, y, size, size, x, y, size, size);

    ctx.fillStyle = backgroundColor;
    ctx.filter = "opacity(0.75)";
    ctx.fillRect(x, y, size, size);
  }

  addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const chosenFields = this.chosenFields;
      if (chosenFields.length)
        chosenFields.forEach((f) => this.drawImage(f, f.color));

      this.chosenFields = [];
      this.select = true;
      this.selectStart = this.getField(e);
    });
  }
}
