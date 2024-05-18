import image from "/spritesheet.png";
import SpriteSheet from "./spritesheet";
import Map from "./map";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <canvas id="spritesheet_canvas"></canvas>
    <canvas id="map_canvas"></canvas>
    <button id="button">download canvas</button>
  </div>
`;

const map = new Map({ width: 36, height: 36 });
const spritesheet = new SpriteSheet(image, (image: ImageData) =>
  map.updateFields(image)
);

document.getElementById("button")!.onclick = () => map.downloadCanvas("canvas");
