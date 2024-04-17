import "./style.css";
import spriteSheetImage from "/spritesheet.png";
import Map from "./map";

const x = 32;
const y = 20;
const size = 32;
const spriteSheetStyle = `width: ${x * size}px; height: ${y * size}px;`;
// const app = document.querySelector<HTMLDivElement>("#app");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <!--
    <div id="spritesheet">
      <img style="${spriteSheetStyle}" src=${spriteSheetImage} />
    </div>
    -->

    <canvas id="game_canvas"></canvas>
  </div>
`;

const map = new Map({ width: 10, height: 8 }, 48);

// <div id="map"></div>
