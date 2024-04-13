import maps from "./maps.js";
import Item from "./item.js";
import Map from "./map.js";

export default class Player {
  setMaps(mapsObj) {
    const maps = {};
    for (const id of Object.keys(mapsObj)) maps[id] = new Map(id);
    return maps;
  }

  setMessages() {
    const map = this.map;
    document.getElementById("equipment").textContent = this.item
      ? this.item.displayName
      : "nothing";
    document.getElementById("items").textContent =
      map.items.length != 0
        ? map.items.map((el) => el.displayName).join(", ")
        : "nothing";
    document.getElementById("map-message").textContent = map.message;
    document.getElementById("directions").textContent = map.directions
      .map((i) => i.toUpperCase())
      .join(", ");
  }

  getStaticItems(map) {
    return map.items.filter((i) => i.name != i.name.toUpperCase());
  }

  go(direction) {
    let map = this.map;
    const message = document.getElementById("message");

    if (map.id == "42" && direction == "west" && !this.dragonDied) {
      const input = document.getElementById("input");
      input.disabled = true;

      message.textContent = "You can't go that way...";
      setTimeout(() => {
        message.textContent = "The dragon sleeps in a cave!";
        setTimeout(() => {
          input.disabled = false;
          input.focus();
          this.setMessages();
        }, 2000);
      }, 2000);
    } else if (map.directions.includes(direction)) {
      const maps = this.maps;
      if (direction == "west") this.map = maps[parseInt(map.id) - 1];
      else if (direction == "east") this.map = maps[parseInt(map.id) + 1];
      else if (direction == "north") this.map = maps[parseInt(map.id) - 10];
      else if (direction == "south") this.map = maps[parseInt(map.id) + 10];

      map = this.map;

      const image = document.getElementById("map-image");
      image.style.background = map.image.background;
      if (map.id == "43" && this.dragonDied)
        image.src = "./assets/img/dragon_died.bmp";
      else image.src = `./assets/img/${map.image.src}`;

      ["north", "east", "south", "west"].forEach((dir) => {
        const img = document.getElementById(`${dir}-compass`);
        if (map.directions.includes(dir)) img.style.display = "none";
        else img.style.display = "block";
      });

      message.textContent = `you are going ${direction}`;
      this.setMessages();
    } else message.textContent = "You can't go that way";
  }

  take(item) {
    const message = document.getElementById("message");

    if (this.item == null) {
      const items = this.map.items;
      const isHere = items.map((i) => i.name).includes(item);

      if (items.map((i) => i.name).includes(item.toLowerCase()) && !isHere)
        message.textContent = `You can't carry it`;
      else if (isHere) {
        const takenItem = items.find((el) => el.name == item);
        this.map.items = items.filter((i) => i.name != item);
        this.item = takenItem;
        message.textContent = `You are taking ${takenItem.displayName}`;
      } else message.textContent = `There isn't anything like that here`;
    } else message.textContent = `You are carrying something`;
    this.setMessages();
  }

  drop(item) {
    const items = this.map.items;
    const message = document.getElementById("message");
    const currItem = this.item;

    if (currItem == null) message.textContent = "You are not carrying anything";
    else if (currItem.name == item) {
      if (items.filter((i) => i.name == i.name.toUpperCase()).length >= 3)
        message.textContent = `You can't store any more here`;
      else {
        this.item = null;
        this.map.items.push(currItem);
        message.textContent = `You are about to drop ${currItem.displayName}`;
      }
    } else message.textContent = "You are not carrying it";
    this.setMessages();
  }

  use(item) {
    const message = document.getElementById("message");
    const input = document.getElementById("input");
    const currItem = this.item;
    const map = this.map;

    if (currItem.name == item) {
      if (currItem.id == "24" && map.id == "11") {
        input.disabled = true;
        message.textContent = "You are digging...";

        setTimeout(() => {
          message.textContent = "and digging...";
          setTimeout(() => {
            message.textContent = " That's enough sulphur for you";
            input.disabled = false;
            input.focus();
            this.item = new Item("25");
            this.setMessages();
          }, 2000);
        }, 2000);
      } else if (currItem.id == "37" && map.id == "43") {
        input.disabled = true;
        message.textContent = "The dragon noticed your gift...";

        setTimeout(() => {
          this.dragonDied = true;
          this.item = null;
          this.map.items.push(new Item("30"));

          const image = document.getElementById("map-image");
          image.src = "./assets/img/dragon_died.bmp";
          message.textContent = "The dragon ate your sheep and died!";

          input.disabled = false;
          input.focus();
          this.setMessages();
        }, 2000);
      } else if (currItem.id == "33" && map.id == "43" && this.dragonDied) {
        this.item = new Item("34");
        message.textContent = "You cut a piece of dragon's skin";
      } else if (currItem.id == "36") {
        document.body.innerHTML = ` <div id="win-container">
                                      <img src="./assets/img/win.jpg" id="win-image" />
                                    </div> `;
      } else if (currItem.usage && currItem.usage.map == map.id) {
        const newItem = new Item((parseInt(this.item.id) + 1).toString());

        if (map.id == "43") {
          this.map.items.push(newItem);
          this.item = null;
          const staticI = this.getStaticItems(map);
          const elementsOfSheepAmount = staticI.length;

          message.textContent = `${currItem.usage.message} (${elementsOfSheepAmount}/6)`;
          if (elementsOfSheepAmount == 6) {
            input.disabled = true;
            setTimeout(() => {
              message.textContent =
                "Your fake sheep is full of poison and ready to be eaten by the dragon";
              this.item = new Item("37");
              this.map.items = map.items.filter((el) => !staticI.includes(el));
              input.disabled = false;
              input.focus();
              this.setMessages();
            }, 2000);
          }
        } else {
          this.item = newItem;
          message.textContent = currItem.usage.message;
        }
      } else message.textContent = "Nothing happened";
    } else message.textContent = "You aren't carrying anything like that";

    if (currItem.id != "36") this.setMessages();
  }

  constructor() {
    this.item = null;
    this.maps = this.setMaps(maps);
    this.map = this.maps["47"];
    this.dragonDied = false;
  }
}
