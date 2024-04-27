import imageSource from "/field.png";

export interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
  image: ImageData | null;
}

export default class BaseMap {
  /**
   * @param size - Size of a single field in px
   */
  protected size: number;
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

  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }

  colorImage(field: Field, backgroundColor: string) {
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;
    const x = field.xPos;
    const y = field.yPos;

    ctx.filter = "opacity(1)";
    if (field.image) ctx.putImageData(field.image, x, y);
    else ctx.putImageData(this.emptyImage, x, y);

    ctx.fillStyle = backgroundColor;
    ctx.filter = "opacity(0.75)";
    ctx.fillRect(x, y, size, size);
  }

  drawImage(field: Field, image: ImageData) {
    this.canvas.getContext("2d")!.putImageData(image, field.xPos, field.yPos);
    this.fields[field.x][field.y].image = image;
  }
}
