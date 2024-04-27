import image from "/spritesheet.png";
import SpriteSheet from "./spritesheet";
import Map from "./map";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <canvas id="spritesheet_canvas"></canvas>
    <canvas id="map_canvas"></canvas>
  </div>
`;

const map = new Map({ width: 24, height: 24 }, 48);
const spritesheet = new SpriteSheet(image, (image: ImageData) =>
  map.updateFields(image)
);
