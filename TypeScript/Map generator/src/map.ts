import BaseMap, { Field } from "./baseMap";
import imageSource from "/field.png";

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

  private selectedFields: Array<Field> = [];
  private select: boolean = false;
  private selectStart: null | Field = null;
  private chosenFields: Array<Field> = [];

  constructor(mapSize: MapSize, size: number = 32) {
    super("map", size);

    this.mapSize = mapSize;
    this.canvas.width = mapSize.width * size;
    this.canvas.height = mapSize.height * size;
    this.emptyImage = new ImageData(size, size);
    this.generateFields();

    this.addMouseDownEventListeners();
    this.addMouseMoveEventListeners();
    this.addMouseUpEventListeners();
    this.addMouseLeaveEventListeners();
    this.addKeyDownEventListener();
    this.addKeyUpEventListener();
  }

  generateFields() {
    const ctx = this.canvas.getContext("2d")!;
    const fields: Array<Array<Field>> = [];
    const size = this.size;
    const mapSize = this.mapSize;

    const image = new Image();
    image.src = imageSource;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, size, size);

      for (let x = 0; x < mapSize.width; x++) {
        const fieldsX: Array<Field> = [];
        for (let y = 0; y < mapSize.height; y++) {
          const xPos = x * size;
          const yPos = y * size;

          ctx.putImageData(imageData, xPos, yPos);
          fieldsX.push({ x, y, xPos, yPos, image: null });
        }
        fields.push(fieldsX);
      }
      this.fields = fields;
    };
  }

  private addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (!this.multiSelect) {
        const chosenFields = this.chosenFields;
        if (chosenFields.length)
          chosenFields.forEach((f) => this.colorImage(f, "transparent"));

        this.chosenFields = [];
      }

      this.select = true;
      this.selectStart = this.getField(e);
    });
  }

  private addMouseMoveEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const field = this.getField(e);
      this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
      this.chosenFields.forEach((f) => this.colorImage(f, "green"));
      this.selectedFields = [];

      if (!this.select) {
        this.colorImage(field, "orange");
        this.selectedFields.push(field);
      } else {
        const start = this.selectStart!;
        const fields = this.fields;

        const verticies = { x: { start: 0, end: 0 }, y: { start: 0, end: 0 } };
        if (field.x > start.x) verticies.x = { start: start.x, end: field.x };
        else verticies.x = { start: field.x, end: start.x };
        if (field.y > start.y) verticies.y = { start: start.y, end: field.y };
        else verticies.y = { start: field.y, end: start.y };

        for (let x = verticies.x.start; x <= verticies.x.end; x++) {
          for (let y = verticies.y.start; y <= verticies.y.end; y++) {
            this.selectedFields.push(fields[x][y]);
            this.colorImage(fields[x][y], "orange");
          }
        }

        this.fields = fields;
      }
    });
  }

  private addMouseUpEventListeners() {
    this.canvas.addEventListener("mouseup", (e) => {
      const field = this.getField(e);
      const start = this.selectStart!;
      if (start.x == field.x && start!.y == field.y) {
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

  private addMouseLeaveEventListeners() {
    this.canvas.addEventListener("mouseleave", () => {
      this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
      this.selectedFields = [];
      this.select = false;
    });
  }

  private addKeyDownEventListener() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        this.chosenFields.forEach((f) => this.colorImage(f, "transparent"));
        this.chosenFields = [];
      } else if (e.key === "Control") this.multiSelect = true;
    });
  }

  public updateFields(image: ImageData) {
    const fields = this.chosenFields;
    if (fields) fields.forEach((field) => this.drawImage(field, image));
    this.chosenFields = [];
    this.selectedFields = [];
  }

  private addKeyUpEventListener() {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Control") this.multiSelect = false;
    });
  }
}

// TODO cut seleted fields when multiselect (ctrl)
