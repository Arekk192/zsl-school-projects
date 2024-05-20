import BaseMap, { Field } from "./baseMap";
import imageSource from "/cell.png";

export default class Map extends BaseMap {
  /**
   * @param mapSize - Amount of fields, map is always a square
   * @param size - Size of a single field in px
   */
  private mapSize: { width: number; height: number };
  public static readonly canvas: HTMLCanvasElement =
    document.querySelector("#map_canvas")!;
  private multiSelect: boolean = false;
  private selectedFields: Array<Field> = [];
  private select: boolean = false;
  private selectStart: null | Field = null;
  private selectPoint: { x: number; y: number } | null = null;
  private chosenFields: Array<Field> = [];

  constructor(mapSize: { width: number; height: number }, size: number = 48) {
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

      context.drawImage(image, 0, 0, size, size);
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

      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      console.log({ x: rect.x, y: rect.y });

      this.selectPoint = { x: e.clientX - rect.x, y: e.clientY - rect.y };
      this.selectStart = this.getField(e);
    });
  }

  private addMouseMoveEventListeners() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d")!;

    canvas.addEventListener("mousemove", (e) => {
      const field = this.getField(e);
      this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
      this.chosenFields.forEach((f) => this.colorImage(f, "green"));
      this.selectedFields = [];

      if (this.selectPoint) {
        // if (!this.select) {
        //   this.colorImage(field, "orange");
        //   this.selectedFields.push(field);
        // } else {
        const start = this.selectStart!;
        const fields = this.fields;
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const startPoint = this.selectPoint!;

        // console.log(startPoint.x, startPoint.y);

        const verticies = { x: { start: 0, end: 0 }, y: { start: 0, end: 0 } };
        if (field.x > start.x) verticies.x = { start: start.x, end: field.x };
        else verticies.x = { start: field.x, end: start.x };
        if (field.y > start.y) verticies.y = { start: start.y, end: field.y };
        else verticies.y = { start: field.y, end: start.y };

        for (let x = verticies.x.start; x <= verticies.x.end; x++) {
          for (let y = verticies.y.start; y <= verticies.y.end; y++) {
            // const field = fields[x][y];
            this.selectedFields.push(fields[x][y]);
            // this.colorImage(fields[x][y], "transparent");
          }
        }

        ctx.fillStyle = "yellow";
        ctx.fillRect(
          startPoint.x,
          startPoint.y,
          e.clientX - rect.x - startPoint.x,
          e.clientY - rect.y - startPoint.y
        );

        this.fields = fields;
      }
    });
  }

  private addMouseUpEventListeners() {
    this.canvas.addEventListener("mouseup", (e) => {
      const field = this.getField(e);
      const start = this.selectStart!;

      if (start.x == field.x && start.y == field.y) {
        let inChosenFields: boolean = false;
        this.chosenFields.forEach((cf) => {
          if (cf.x == field.x && cf.y == field.y) inChosenFields = true;
        });

        if (inChosenFields) {
          this.colorImage(field, "transparent");
          this.chosenFields = this.chosenFields.filter(
            (f) => f.x != field.x || f.y != field.y
          );
        } else {
          this.colorImage(field, "green");
          this.chosenFields.push(field);
        }
      } else {
        let chosenFields = this.chosenFields;
        const selectedFields = this.selectedFields;
        const duplicatesArray: Array<Field> = [];

        selectedFields.forEach((f) =>
          chosenFields.forEach((cf) => {
            if (f.x == cf.x && f.y == cf.y) duplicatesArray.push(f);
          })
        );
        selectedFields.forEach((f) => chosenFields.push(f));

        chosenFields = chosenFields.filter((cf) => {
          let duplicated: boolean = false;
          duplicatesArray.forEach((f) => {
            if (f.x == cf.x && f.y == cf.y) duplicated = true;
          });
          return !duplicated;
        });

        duplicatesArray.forEach((f) => this.colorImage(f, "transparent"));
        chosenFields.forEach((f) => this.colorImage(f, "green"));

        this.chosenFields = chosenFields;
        this.selectedFields = [];
      }
      this.select = false;
      this.selectPoint = null;
    });
  }

  private addMouseLeaveEventListeners() {
    this.canvas.addEventListener("mouseleave", () => {
      this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
      this.selectedFields = [];
      this.selectPoint = null;
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

  private addKeyUpEventListener() {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Control") this.multiSelect = false;
    });
  }

  public updateFields(image: ImageData) {
    const fields = this.chosenFields;
    if (fields) fields.forEach((field) => this.drawImage(field, image));
    this.chosenFields = [];
    this.selectedFields = [];
  }

  public downloadCanvas(filename: string) {
    const link = document.createElement("a");
    link.href = this.canvas.toDataURL("image/png");
    link.download = `${filename}.png`;
    link.click();
  }

  public setFields() {
    this.resetSelect();
    const fields = this.fields;
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;

    for (let i = 0; i < fields.length; i++) {
      for (let j = 0; j < fields[0].length; j++) {
        const field = fields[i][j];
        const img = ctx.getImageData(field.xPos, field.yPos, size, size);
        fields[i][j].image = img;
      }
    }
  }

  private resetSelect() {
    this.selectPoint = null;
    this.selectStart = null;
    this.select = false;
    this.selectedFields = [];
    this.chosenFields = [];
  }
}

// TODO "automat"
// TODO export data to file

// TODO copy paste
// TODO undo redo
