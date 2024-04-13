const items = {
  10: {
    displayName: "a KEY",
    name: "KEY",
    usage: { map: "56", message: "You opened a tool shed and took an axe" },
  },
  11: {
    displayName: "an AXE",
    name: "AXE",
    usage: { map: "67", message: "You cut sticks for sheeplegs" },
  },
  12: {
    displayName: "STICKS",
    name: "STICKS",
    usage: { map: "43", message: "You prepared legs for your fake sheep" },
  },
  13: { displayName: "sheeplegs", name: "sheeplegs" },
  14: {
    displayName: "MUSHROOMS",
    name: "MUSHROOMS",
    usage: { map: "34", message: "The tavern owner paid you money" },
  },
  15: {
    displayName: "MONEY",
    name: "MONEY",
    usage: { map: "37", message: "The cooper sold you a new barrel" },
  },
  16: {
    displayName: "a BARREL",
    name: "BARREL",
    usage: { map: "43", message: "You made a nice sheeptrunk" },
  },
  17: { displayName: "a sheeptrunk", name: "sheeptrunk" },
  18: {
    displayName: "BERRIES",
    name: "BERRIES",
    usage: { map: "36", message: "The butcher gave you wool" },
  },
  19: {
    displayName: "WOOL",
    name: "WOOL",
    usage: { map: "43", message: "You prepared skin for your fake sheep" },
  },
  20: {
    displayName: "a sheepskin",
    name: "sheepskin",
  },
  21: {
    displayName: "a BAG",
    name: "BAG",
    usage: { map: "57", message: "You used your tools to make a rag" },
  },
  22: {
    displayName: "a RAG",
    name: "RAG",
    usage: { map: "43", message: "You made a fake sheephead" },
  },
  23: { displayName: "a sheephead", name: "sheephead" },
  24: { displayName: "a SPADE", name: "SPADE" },
  25: {
    displayName: "SULPHUR",
    name: "SULPHUR",
    usage: { map: "43", message: "You prepared a solid poison" },
  },
  26: { displayName: "a solid poison", name: "solid poison" },
  27: {
    displayName: "a BUCKET",
    name: "BUCKET",
    usage: { map: "21", message: "You got a bucket full of tar" },
  },
  28: {
    displayName: "TAR",
    name: "TAR",
    usage: { map: "43", message: "You prepared a liquid poison" },
  },
  29: { displayName: "a liquid poison", name: "liquid poison" },
  30: { displayName: "a dead dragon", name: "dead dragon" },
  31: { displayName: "a STONE", name: "STONE" },
  32: { displayName: "a FISH", name: "FISH" },
  33: { displayName: "a KNIFE", name: "KNIFE" },
  34: {
    displayName: "a DRAGONSKIN",
    name: "DRAGONSKIN",
    usage: { map: "57", message: "You used your tools to make shoes" },
  },
  35: {
    displayName: "a dragonskin SHOES",
    name: "SHOES",
    usage: { map: "41", message: "The King is impressed by your shoes" },
  },
  36: { displayName: "a PRIZE", name: "PRIZE" },
  37: { displayName: "a SHEEP", name: "SHEEP" },
};
export default items;

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
