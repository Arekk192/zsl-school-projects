import items from "./items.js";

export default class Item {
  constructor(id) {
    const data = items[id];
    this.id = id;
    this.name = data.name;
    this.displayName = data.displayName;
    this.usage = data.usage ? data.usage : null;
  }
}
