import BaseMap, { Field } from "./baseMap";

export default class SpriteSheet extends BaseMap {
  private cursor: Field | null = null;
  private updateState: (image: ImageData) => void;

  constructor(src: string, updateState: (image: ImageData) => void, size = 48) {
    super("spritesheet", size);

    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.canvas
        .getContext("2d")!
        .drawImage(image, 0, 0, 32 * size, 20 * size);

      this.setFields();
      this.addMouseDownEventListeners();
      this.addMouseMoveEventListeners();
      this.addMouseLeaveEventListeners();
    };
    this.updateState = updateState;
  }

  setFields() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d")!;
    const size = this.size;
    const fields: Array<Array<Field>> = [];

    for (let x = 0; x < canvas.width / size; x++) {
      const fieldsX: Array<Field> = [];
      for (let y = 0; y < canvas.height / size; y++) {
        const xPos = x * size;
        const yPos = y * size;
        const image = ctx.getImageData(xPos, yPos, size, size);
        fieldsX.push({ x, y, xPos, yPos, image });
      }
      fields.push(fieldsX);
    }
    this.fields = fields;
  }

  private addMouseMoveEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.cursor) this.colorImage(this.cursor, "transparent");
      const field = this.getField(e);
      this.cursor = field;
      this.colorImage(field, "orange");
    });
  }

  private addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const field = this.getField(e);
      this.updateState(field.image!);
    });
  }

  private addMouseLeaveEventListeners() {
    this.canvas.addEventListener("mouseleave", () => {
      this.colorImage(this.cursor!, "transparent");
      this.cursor = null;
    });
  }
}
