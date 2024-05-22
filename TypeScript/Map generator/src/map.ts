import BaseMap, { Field } from "./baseMap";
import imageSource from "/field-32.png";

export default class Map extends BaseMap {
  /**
   * @param mapSize - Amount of fields, map is always a square
   * @param size - Size of a single field in px
   */
  private mapSize: { width: number; height: number };
  public static readonly canvas: HTMLCanvasElement =
    document.querySelector("#map_canvas")!;
  private selectMulti: boolean = false;
  private selectData: { point: { x: number; y: number }; field: Field } | null =
    null;
  private selectingFields: Array<Field> = [];
  private selectedFields: Array<Field> = [];

  private copyImageData: Array<Array<Field | null>> | null = null;
  private pasting: boolean = false;
  private lastPastedFields: Array<Field> = [];

  private history: Array<ImageData> = [];
  private historyState: number = 0;

  private automat: boolean = false;
  private automatLastField: Field | null = null;

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

  private generateFields() {
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
      const map = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.history.push(map);
      this.fields = fields;
    };
  }

  private addMouseDownEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (!this.pasting) {
        if (!this.selectMulti) {
          this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
          this.selectedFields = [];
        }

        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const point = { x: e.clientX - rect.x, y: e.clientY - rect.y };
        this.selectData = { point, field: this.getField(e) };
      }
    });
  }

  private addMouseMoveEventListeners() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d")!;

    canvas.addEventListener("mousemove", (e) => {
      const field = this.getField(e);
      this.selectingFields.forEach((f) => this.colorImage(f, "transparent"));
      this.selectedFields.forEach((f) => this.colorImage(f, "green"));
      this.selectingFields = [];

      if (this.pasting) {
        const canvas = this.canvas;
        const ctx = canvas.getContext("2d")!;
        const fields = this.copyImageData!;
        const size = this.size;
        const ms = this.mapSize;

        this.lastPastedFields.forEach((f) => this.colorImage(f, "transparent"));
        this.lastPastedFields = [];

        for (let x = 0; x < fields.length; x++) {
          for (let y = 0; y < fields[0].length; y++) {
            const fieldX = x + field.x;
            const fieldY = y + field.y;

            if (fields[x][y] && fieldX < ms.width && fieldY < ms.height) {
              if (fields[x][y]!.image) {
                const xPos = fieldX * size;
                const yPos = fieldY * size;
                ctx.putImageData(fields[x][y]!.image!, xPos, yPos);
              }
              this.lastPastedFields.push(this.fields[x + field.x][y + field.y]);
            }
          }
        }
      } else if (this.selectData) {
        const fields = this.fields;
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const start = this.selectData.field!;
        const point = this.selectData.point!;

        const verticies = { x: { start: 0, end: 0 }, y: { start: 0, end: 0 } };
        if (field.x > start.x) verticies.x = { start: start.x, end: field.x };
        else verticies.x = { start: field.x, end: start.x };
        if (field.y > start.y) verticies.y = { start: start.y, end: field.y };
        else verticies.y = { start: field.y, end: start.y };

        for (let x = verticies.x.start; x <= verticies.x.end; x++)
          for (let y = verticies.y.start; y <= verticies.y.end; y++)
            this.selectingFields.push(fields[x][y]);

        const width = e.clientX - rect.x - point.x;
        const height = e.clientY - rect.y - point.y;
        ctx.fillStyle = "yellow";
        ctx.fillRect(point.x, point.y, width, height);

        this.fields = fields;
      }
    });
  }

  private addMouseUpEventListeners() {
    this.canvas.addEventListener("mouseup", (e) => {
      if (this.pasting) {
        this.setFields();
        this.setHistory();
      } else {
        const field = this.getField(e);
        const start = this.selectData!.field!;

        if (start.x == field.x && start.y == field.y) {
          let inSelectedFields: boolean = false;
          this.selectedFields.forEach((cf) => {
            if (cf.x == field.x && cf.y == field.y) inSelectedFields = true;
          });

          if (inSelectedFields) {
            this.colorImage(field, "transparent");
            this.selectedFields = this.selectedFields.filter(
              (f) => f.x != field.x || f.y != field.y
            );
          } else {
            this.colorImage(field, "green");
            this.selectedFields.push(field);
          }
        } else {
          let selectedFields = this.selectedFields;
          const selectingFields = this.selectingFields;
          const duplicatesArray: Array<Field> = [];

          selectingFields.forEach((f) =>
            selectedFields.forEach((cf) => {
              if (f.x == cf.x && f.y == cf.y) duplicatesArray.push(f);
            })
          );
          selectingFields.forEach((f) => selectedFields.push(f));

          selectedFields = selectedFields.filter((cf) => {
            let duplicated: boolean = false;
            duplicatesArray.forEach((f) => {
              if (f.x == cf.x && f.y == cf.y) duplicated = true;
            });
            return !duplicated;
          });

          duplicatesArray.forEach((f) => this.colorImage(f, "transparent"));
          selectedFields.forEach((f) => this.colorImage(f, "green"));

          this.selectedFields = selectedFields;
          this.selectingFields = [];
        }

        this.selectData = null;
      }
    });
  }

  private addMouseLeaveEventListeners() {
    this.canvas.addEventListener("mouseleave", () => {
      this.selectingFields.forEach((f) => this.colorImage(f, "transparent"));
      this.selectingFields = [];
      this.selectData = null;
      this.selectMulti = false;
    });
  }

  private addKeyDownEventListener() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "c") {
        const selectedFields = this.selectedFields;
        if (selectedFields.length) {
          const coords = {
            minY: Math.min(...selectedFields.map((f) => f.y)),
            minX: Math.min(...selectedFields.map((f) => f.x)),
            maxY: Math.max(...selectedFields.map((f) => f.y)),
            maxX: Math.max(...selectedFields.map((f) => f.x)),
          };

          const fields = this.fields;
          const copyFields: Array<Array<Field | null>> = [];
          for (let x = coords.minX; x <= coords.maxX; x++) {
            const xFields: Array<Field | null> = [];
            for (let y = coords.minY; y <= coords.maxY; y++) {
              let inSelectedFields = false;
              const f = fields[x][y];
              selectedFields.forEach((cf) => {
                if (cf.x == f.x && cf.y == f.y) inSelectedFields = true;
              });
              inSelectedFields
                ? xFields.push(fields[x][y])
                : xFields.push(null);
            }
            copyFields.push(xFields);
          }

          selectedFields.forEach((f) => this.colorImage(f, "transparent"));
          this.selectedFields = [];
          this.copyImageData = copyFields;
        }
      } else if (e.ctrlKey && e.key === "v") this.pasting = true;
      else if (e.ctrlKey && e.key === "z") {
        if (this.historyState > 0) {
          const canvas = this.canvas;
          const ctx = canvas.getContext("2d")!;
          ctx.putImageData(this.history[this.historyState - 1], 0, 0);
          this.setFields();
          this.historyState--;
        }
      } else if (e.ctrlKey && e.key === "y") {
        if (this.historyState < this.history.length - 1) {
          const canvas = this.canvas;
          const ctx = canvas.getContext("2d")!;
          ctx.putImageData(this.history[this.historyState + 1], 0, 0);
          this.setFields();
          this.historyState++;
        }
      } else if (e.ctrlKey) this.selectMulti = true;
      else if (e.key === "Delete" || e.key === "Escape") {
        this.selectedFields.forEach((f) => this.colorImage(f, "transparent"));
        this.selectedFields = [];
        this.pasting = false;
        this.lastPastedFields.forEach((f) => this.colorImage(f, "transparent"));
        this.lastPastedFields = [];
      }
    });
  }

  private addKeyUpEventListener() {
    document.addEventListener("keyup", (e) => {
      if (e.ctrlKey) this.selectMulti = false;
      else if (e.ctrlKey && e.key === "v") this.pasting = false;
    });
  }

  public updateFields(image: ImageData) {
    if (this.selectedFields.length) {
      const fields = this.selectedFields;
      if (fields) fields.forEach((field) => this.drawImage(field, image));
      this.selectedFields = [];
      this.selectingFields = [];
      this.setHistory();

      if (this.automat) {
        const canvas = this.canvas;
        this.automatLastField = fields.sort(
          (a, b) => b.x + b.y * canvas.height - a.x - a.y * canvas.height
        )[0];
      }
    } else if (this.automat && this.automatLastField) {
      const ms = this.mapSize;
      const lastField = this.automatLastField;
      let nextField: Field | null = null;

      if (lastField.y != ms.height - 1 || lastField.x != ms.width - 1) {
        if (lastField.x != ms.width - 1)
          nextField = this.fields[lastField.x + 1][lastField.y];
        else nextField = this.fields[0][lastField.y + 1];
      }

      if (nextField) {
        this.drawImage(nextField, image);
        this.automatLastField = nextField;
      }
    }
  }

  private setHistory() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d")!;
    this.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (this.historyState != this.history.length - 2)
      this.history = this.history.filter((_, i) => i <= this.historyState);

    this.historyState++;
  }

  public setFields() {
    this.selectData = null;
    this.selectMulti = false;
    this.selectingFields = [];
    this.selectedFields = [];
    this.lastPastedFields = [];
    this.copyImageData = null;
    this.pasting = false;

    const fields = this.fields;
    const ctx = this.canvas.getContext("2d")!;
    const size = this.size;

    for (let i = 0; i < fields.length; i++) {
      for (let j = 0; j < fields[0].length; j++) {
        const f = fields[i][j];
        fields[i][j].image = ctx.getImageData(f.xPos, f.yPos, size, size);
      }
    }
  }

  public downloadCanvas(filename: string) {
    const link = document.createElement("a");
    link.href = this.canvas.toDataURL("image/png");
    link.download = `${filename}.png`;
    link.click();
  }

  public setAutomat(value: boolean) {
    this.automat = value;
  }
}
