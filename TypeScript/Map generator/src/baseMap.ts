// interface MapSize {
//   width: number;
//   height: number;
// }

interface Field {
  x: number;
  y: number;
  xPos: number;
  yPos: number;
  color: string;
}

export default class BaseMap {
  /**
   * @param mapSize - Amount of fields, map is always a square
   * @param size - Size of a single field in px
   */
  // public mapSize: MapSize;
  public size: number;
  readonly canvas: HTMLCanvasElement;
  private fields: Array<Array<Field>> = [];

  constructor(canvas: string, size: number = 48) {
    // this.mapSize = { width: 10, height: 32 };
    this.size = size;
    this.canvas = document.querySelector<HTMLCanvasElement>(`#${canvas}`)!;
  }

  getField(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / this.size);
    const y = Math.floor((e.clientY - rect.y) / this.size);
    return this.fields[x][y];
  }
}

// ------ COMMON FUNCTIONALITIES ------
// select field, select multiple fields
// like delete, ctrl, enter

// ----------- MAP CLASS --------------
// color fields

// -------- SPRITESHEET CLASS ---------
// spritesheet class
// save state
