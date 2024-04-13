import maps from "./maps.js";
import Item from "./item.js";

export default class Map {
  constructor(id) {
    const data = maps[id];
    this.id = id;
    this.directions = data.directions;
    this.message = data.message;
    this.image = data.image;
    this.items = this.setItems(id);
  }

  setItems(id) {
    if (id == "13") return [new Item("31")];
    else if (id == "15") return [new Item("27")];
    else if (id == "17") return [new Item("14")];
    else if (id == "23") return [new Item("10")];
    else if (id == "27") return [new Item("18")];
    else if (id == "32") return [new Item("32")];
    else if (id == "44") return [new Item("21")];
    else if (id == "55") return [new Item("33")];
    else if (id == "64") return [new Item("24")];
    else return [];
  }
}
