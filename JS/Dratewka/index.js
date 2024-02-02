
const locations = {
  11: {
    directions: [ "east"],
    message: "You are inside a brimstone mine",
    image: { src: "11.gif", background: "rgb(235,211,64)" },
  },

  12: {
    directions: [  'east',  'west' ],
    message: "You are at the entrance to the mine",
    image: { src: "12.gif", background: "rgb(89,93,87)" },
  },
  13: {
    directions: [ 'east', 'south', 'west' ],
    message: "A hill",
    image: { src: "13.gif", background: "rgb(117,237,243)" },
  },
  14: {
    directions: [ 'east',  'west' ],
    message: "Some bushes",
    image: { src: "14.gif", background: "rgb(202,230,51)" },
  },
  15: {
    directions: [ 'east',  'west' ],
    message: "An old deserted hut",
    image: { src: "15.gif", background: "rgb(220,204,61)" },
  },
  16: {
    directions: [ 'east',  'west' ],
    message: "The edge of a forest",
    image: { src: "16.gif", background: "rgb(167,245,63)" },
  },
  17: {
    directions: [  'south', 'west' ],
    message: "A dark forest",
    image: { src: "17.gif", background: "rgb(140,253,99)" },
  },
  21: {
    directions: [ 'east', 'south'],
    message: "A man nearby making tar",
    image: { src: "21.gif", background: "rgb(255,190,99)" },
  },
  22: {
    directions: [ 'east', 'south', 'west' ],
    message: "A timber yard",
    image: { src: "22.gif", background: "rgb(255,190,99)" },
  },
  23: {
    directions: [ 'north', 'east', 'south', 'west' ],
    message: "You are by a roadside shrine",
    image: { src: "23.gif", background: "rgb(167,245,63)" },
  },
  24: {
    directions: [ 'east',  'west' ],
    message: "You are by a small chapel",
    image: { src: "24.gif", background: "rgb(212,229,36)" },
  },
  25: {
    directions: [ 'east', 'south', 'west' ],
    message: "You are on a road leading to a wood",
    image: { src: "25.gif", background: "rgb(167,245,63)" },
  },
  26: {
    directions: [ 'east',  'west' ],
    message: "You are in a forest",
    image: { src: "26.gif", background: "rgb(167,245,63)" },
  },
  27: {
    directions: [ 'north',   'west' ],
    message: "You are in a deep forest",
    image: { src: "27 i 67.gif", background: "rgb(140,253,99)" },
  },
  31: {
    directions: [ 'north', 'east' ],
    message: "You are by the Vistula River",
    image: { src: "31.gif", background: "rgb(122,232,252)" },
  },
  32: {
    directions: [ 'north',   'west' ],
    message: "You are by the Vistula River",
    image: { src: "32.gif", background: "rgb(140,214,255)" },
  },
  33: {
    directions: [ 'north', 'south' ],
    message: "You are on a bridge over river",
    image: { src: "33.gif", background: "rgb(108,181,242)" },
  },
  34: {
    directions: [ 'east' ],
    message: "You are by the old tavern",
    image: { src: "34.gif", background: "rgb(255,189,117)" },
  },
  35: {
    directions: [ 'north', 'south', 'west' ],
    message: "You are at the town's end",
    image: { src: "35.gif", background: "rgb(255,190,99)" },
  },
  36: {
    directions: [ 'south' ],
    message: "You are in a butcher's shop",
    image: { src: "36.gif", background: "rgb(255,188,102)" },
  },
  37: {
    directions: [ 'south' ],
    message: "You are in a cooper's house",
    image: { src: "37.gif", background: "rgb(255,188,102)" },
  },
  41: {
    directions: [ 'north', 'south', 'east', 'west' ], // special case
    message: "You are in the Wawel Castle",
    image: { src: "41.gif", background: "rgb(255,176,141)" },
  },
  42: {
    directions: [ 'east', 'west' ],
    message: "You are inside a dragon's cave",
    image: { src: "42.gif", background: "rgb(198,205,193)" },
  },
  43: {
    directions: [ 'north', 'west' ],
    message: "A perfect place to set a trap",
    image: { src: "43.gif", background: "rgb(255,176,141)" },
  },
  44: {
    directions: [ 'east' ],
    message: "You are by the water mill",
    image: { src: "44.gif", background: "rgb(255,190,99)" },
  },
  45: {
    directions: [ 'north', 'south', 'east', 'west' ],
    message: "You are at a main crossroad",
    image: { src: "45.gif", background: "rgb(255,190,99)" },
  },
  46: {
    directions: [ 'north', 'east', 'west' ],
    message: "You are on a town street",
    image: { src: "46.gif", background: "rgb(255,190,99)" },
  },
  47: {
    directions: [ 'north', 'south', 'west' ],
    message: "You are in a frontyard of your house",
    image: { src: "47.gif", background: "rgb(255,190,99)" },
  },
  54: {
    directions: [ 'east' ],
    message: "You are by a swift stream",
    image: { src: "54.gif", background: "rgb(108,181,242)" },
  },
  55: {
    directions: [ 'north', 'south', 'west'],
    message: "You are on a street leading forest",
    image: { src: "55.gif", background: "rgb(255,190,99)" },
  },
  56: {
    directions: [ 'south' ],
    message: "You are in a woodcutter's backyard",
    image: { src: "56.gif", background: "rgb(255,190,99)" },
  },
  57: {
    directions: [ 'north' ],
    message: "You are in a shoemaker's house",
    image: { src: "57.gif", background: "rgb(254,194,97)" },
  },
  64: {
    directions: [ 'east' ],
    message: "You are in a bleak funeral house",
    image: { src: "64.gif", background: "rgb(254,194,97)" },
  },
  65: {
    directions: [ 'north', 'east', 'west'],
    message: "You are on a path leading to the wood",
    image: { src: "26 i 65.gif", background: "rgb(167,245,63)" },
  },
  66: {
    directions: [ 'north', 'east', 'west'],
    message: "You are at the edge of a forest",
    image: { src: "66.gif", background: "rgb(167,245,63)" },
  },
  67: {
    directions: [ 'west'],
    message: "You are in a deep forest",
    image: { src: "27 i 67.gif", background: "rgb(140,253,99)" },
  },
};

const items = {
  10: { displayName: "a KEY", canBeTaken: true, name: "KEY" },
  11: { displayName: "an AXE", canBeTaken: true, name: "AXE" },
  12: { displayName: "STICKS", canBeTaken: true, name: "STICKS" },
  13: { displayName: "sheeplegs", canBeTaken: false, name: "sheeplegs" },
  14: { displayName: "MUSHROOMS", canBeTaken: true, name: "MUSHROOMS" },
  15: { displayName: "MONEY", canBeTaken: true, name: "MONEY" },
  16: { displayName: "a BARREL", canBeTaken: true, name: "BARREL" },
  17: { displayName: "a sheeptrunk", canBeTaken: false, name: "sheeptrunk" },
  18: { displayName: "BERRIES", canBeTaken: true, name: "BERRIES" },
  19: { displayName: "WOOL", canBeTaken: true, name: "WOOL" },
  20: { displayName: "a sheepskin", canBeTaken: false, name: "sheepskin" },
  21: { displayName: "a BAG", canBeTaken: true, name: "BAG" },
  22: { displayName: "a RAG", canBeTaken: true, name: "RAG" },
  23: { displayName: "a sheephead", canBeTaken: false, name: "sheephead" },
  24: { displayName: "a SPADE", canBeTaken: true, name: "SPADE" },
  25: { displayName: "SULPHUR", canBeTaken: true, name: "SULPHUR" },
  26: { displayName: "a solid poison", canBeTaken: false, name: "solid poison" },
  27: { displayName: "a BUCKET", canBeTaken: true, name: "BUCKET" },
  28: { displayName: "TAR", canBeTaken: true, name: "TAR" },
  29: { displayName: "a liquid poison", canBeTaken: false, name: "liquid poison" },
  30: { displayName: "a dead dragon", canBeTaken: false, name: "dead dragon" },
  31: { displayName: "a STONE", canBeTaken: true, name: "STONE" },
  32: { displayName: "a FISH", canBeTaken: true, name: "FISH" },
  33: { displayName: "a KNIFE", canBeTaken: true, name: "KNIFE" },
  34: { displayName: "a DRAGONSKIN", canBeTaken: true, name: "DRAGONSKIN" },
  35: { displayName: "a dragonskin SHOES", canBeTaken: true, name: "SHOES" },
  36: { displayName: "a PRIZE", canBeTaken: true, name: "PRIZE" },
  37: { displayName: "a SHEEP", canBeTaken: true, name: "SHEEP" },
}

class Item {
  constructor(id, name, displayName, canBeTaken) {
    this.id = id
    this.name = name
    this.displayName = displayName
    this.canBeTaken = canBeTaken
  }
}

class Location {
  constructor(id, directions, message, image) {
    this.id = id
    this.directions = directions
    this.message = message
    this.image = image

  }

  setItem() {

  }

  takeItem() {

  }

  dropItem() {

  }
}

class Player {
  constructor() {
    this.items = []
  }
}

const setLocations = (locationsObj) => {
  const locations = {}
  for (const [id, data] of Object.entries(locationsObj))
    locations[id] = new Location(id, data.directions, data.message, data.image)
  return locations;
}

const setItems = (itemsObj) => {
  const items = {}
  for (const [id, data] of Object.entries(itemsObj))
    items[id] = new Item(id, data.name, data.displayName, data.canBeTaken)
  return items;
}

console.log(setItems(items))

const setFocusOnInput = () => {
  const input = document.getElementById("input");
  input.focus();
};

// PRZEDMIOTY NA STARCIE:
// lokacja (YX) - id_przedmiotu

// 13 - 31
// 15 - 27
// 17 - 14
// 23 - 10
// 27 - 18
// 32 - 32
// 44 - 21
// 55 - 33
// 64 - 24



// ZALEŻNOŚCI:
// użyty_przedmiot (id_przedmiotu), lokacja (YX), wynik_użycia (id_przedmiotu), komunikat, OK (kamień milowy)
// - nowy przedmiot zwykle ląduje w dłoni. Oznaczono "L" jeśli na lokacji (części owcy)
// - przedmiot po użyciu znika z rąk
// uwaga: ilość "L" dokładnie taka sama jak **flag 0 - część owcy na lokacji 43 (przedpola pieczary)

// 10, 56, 11, You opened a tool shed and took an axe
// 11, 67, 12, You cut sticks for sheeplegs
// 12, 43, 13(L), You prepared legs for your fake sheep, OK
// 14, 34, 15, The tavern owner paid you money
// 15, 37, 16, The cooper sold you a new barrel
// 16, 43, 17(L), You made a nice sheeptrunk, OK
// 18, 36, 19, The butcher gave you wool
// 19, 43, 20(L), You prepared skin for your fake sheep, OK
// 21, 57, 22, You used your tools to make a rag
// 22, 43, 23(L), You made a fake sheephead, OK
// 24, 11, 25, You are digging... (timeout) and digging... (timeout) That's enough sulphur for you
// 25, 43, 26(L), You prepared a solid poison, OK
// 27, 21, 28, You got a bucket full of tar
// 28, 43, 29(L), You prepared a liquid poison, OK
// gdy zebrane wszystkie przedmioty (6*OK), 43, 37, Your fake sheep is full of poison and ready to be eaten by the dragon
// 37, 43, 30(L), The dragon noticed your gift... (timeout) The dragon ate your sheep and died! - podmiana grafiki na lokacji (martwy smok)!
// 33, 43 + zabity smok, 34, You cut a piece of dragon's skin
// 34, 57, 35, You used your tools to make shoes
// 35, 41, 36, The King is impressed by your shoes
// 36 -> koniec gry - załadowanie odpowiedniej grafiki
