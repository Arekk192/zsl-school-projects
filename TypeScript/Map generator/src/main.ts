import image from "/spritemap-horizontal-32.png";
import SpriteSheet from "./spritesheet";
import Map from "./map";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <header>
      <div id="load-map">
        <label for="load-map-button">load a map</label>
        <input type="file" name="image" id="load-map-button" />
      </div>
      <div id="save-map">
        <button role="button" id="save-map-button">save a map</button>
      </div>
      <div id="set-automat">
        <p>automat:</p>
        <!-- <input type="checkbox" id="checkbox" /> -->
        <div class="checkbox-wrapper">
          <input class="tgl tgl-light" id="checkbox" type="checkbox"/>
          <label class="tgl-btn" for="checkbox">
        </div>
      </div>
    </header>
    <div style="display: flex; align-items: flex-start; justify-content: center;">
      <canvas style="margin: 16px;" id="spritesheet_canvas"></canvas>
      <canvas style="margin: 16px;" id="map_canvas"></canvas>
    </div>
  </div>
`;

let map = new Map({ width: 16, height: 40 }, 32);
const spritesheet = new SpriteSheet(
  image,
  (image: ImageData) => map.updateFields(image),
  32
);

spritesheet.setFields();

(document.querySelector("#save-map-button") as HTMLElement).onclick = () =>
  map.downloadCanvas("canvas");

(document.querySelector("#load-map-button") as HTMLElement).onchange = (e) => {
  const input = e.target as HTMLInputElement;
  const file = input.files![0];
  const canvas = document.querySelector("#map_canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  if (file && file.type === "image/png") {
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      const dataURL = e.target!.result as string;
      const img = new Image();
      img.onload = function () {
        ctx.filter = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        map.setFields();
      };
      img.src = dataURL;
    };
    reader.readAsDataURL(file);
  }
};

(document.querySelector("#checkbox") as HTMLInputElement).onchange = (e) =>
  map.setAutomat((e.target as HTMLInputElement).checked);
