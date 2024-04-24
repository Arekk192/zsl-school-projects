import "./style.css";
import spriteSheetImage from "/spritesheet.png";
import Map from "./map";
import SpriteSheet from "./spritesheet";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <canvas id="spritesheet_canvas"></canvas>
    <canvas id="map_canvas"></canvas>
  </div>
`;

const spritesheet = new SpriteSheet(spriteSheetImage);
const map = new Map({ width: 10, height: 8 }, 48);
