import imageSource from "../public/field-32.png";

export interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
  image: ImageData | null;
}

export default class BaseMap {
  /**
   * Base map class containing functions
   * @param size Size of a single field in px
   * @param canvas "map" or "spritesheet" - used in querySelector to select canvas by id
   */
  protected readonly size: number;
  protected readonly canvas: HTMLCanvasElement;
  protected fields: Array<Array<Field>> = [];
  protected emptyImage: ImageData;

  constructor(canvas: "spritesheet" | "map", size: number = 48) {
    this.size = size;
    this.canvas = document.querySelector<HTMLCanvasElement>(
      `#${canvas}_canvas`
    )!;
    this.emptyImage = new ImageData(size, size);

    const image = new Image();
    image.src = imageSource;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, size, size);
      this.emptyImage = imageData;
    };
  }

  /**
   * Returns field basing on mouse position
   * @param e MouseEvent (when mousemove, mousedown, mouseup)
   * @returns field which is under mouse cursor
   */
  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }

  /**
   * Colors the field to color pasted as an argument
   * @param field Field which should be colored
   * @param backgroundColor background color to field in canvas (will be applied with opacity 0.75)
   * @returns field which is under mouse cursor
   */
  colorImage(field: Field, backgroundColor: string) {
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;
    const x = field.xPos;
    const y = field.yPos;
    const image = field.image ? field.image : this.emptyImage;
    ctx.putImageData(image, x, y);

    ctx.fillStyle = backgroundColor;
    ctx.filter = "opacity(0.75)";
    ctx.fillRect(x, y, size, size);
  }

  /**
   * Changes the field's image
   * @param field field which should be changed
   * @param image image to apply
   */
  drawImage(field: Field, image: ImageData) {
    this.canvas.getContext("2d")!.putImageData(image, field.xPos, field.yPos);
    this.fields[field.x][field.y].image = image;
  }
}
