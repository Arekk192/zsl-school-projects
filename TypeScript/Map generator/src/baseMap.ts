export interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
  color: string;
}

export default class BaseMap {
  /**
   * @param size - Size of a single field in px
   */
  public size: number;
  public readonly canvas: HTMLCanvasElement;
  protected fields: Array<Array<Field>> = [];
  protected selectedFields: Array<Field> = [];
  protected select: boolean = false;
  protected selectStart: null | Field = null;
  protected chosenFields: Array<Field> = [];

  constructor(canvas: "spritesheet" | "map", size: number = 48) {
    this.size = size;
    this.canvas = document.querySelector<HTMLCanvasElement>(
      `#${canvas}_canvas`
    )!;
  }

  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }

  addMouseUpEventListeners() {
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

  addMouseMoveEventListeners(
    callback: (field: Field, argument: string) => void
  ) {
    this.canvas.addEventListener("mousemove", (e) => {
      const field = this.getField(e);
      this.selectedFields.forEach((f) => callback(f, "transparent")); // "green" for
      // map.ts tests, now I keep transparent for testing spritesheet
      this.chosenFields.forEach((f) => callback(f, "green"));
      this.selectedFields = [];

      if (!this.select) {
        callback(field, "orange");
        this.selectedFields.push(field);
      } else {
        const start = this.selectStart!;
        const fields = this.fields;

        let startX: number;
        let endX: number;
        let startY: number;
        let endY: number;

        if (field.x > start.x) {
          startX = start.x;
          endX = field.x;
        } else {
          startX = field.x;
          endX = start.x;
        }
        if (field.y > start.y) {
          startY = start.y;
          endY = field.y;
        } else {
          startY = field.y;
          endY = start.y;
        }

        for (let x = startX; x <= endX; x++) {
          for (let y = startY; y <= endY; y++) {
            this.selectedFields.push(fields[x][y]);
            callback(fields[x][y], "green");
          }
        }

        this.fields = fields;
      }
    });
  }
}

// ------ COMMON FUNCTIONALITIES ------
// select fields

// ----------- MAP CLASS --------------
// color fields
// select multiple fields - delete, ctrl, enter

// -------- SPRITESHEET CLASS ---------
// draw image
// spritesheet class
// save state
