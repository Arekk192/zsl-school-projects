import Player from "./modules/player.js";

const player = new Player();
let menu = true;

// #region menu functions
const hideMenu = () => {
  document.getElementById("messages").style.display = "none";
  document.getElementById("message-container").style.display = "none";
  document.getElementById("input-container").style.display = "none";
};

const showMenu = () => {
  document.getElementById("messages").style.display = "block";
  document.getElementById("message-container").style.display = "block";
  document.getElementById("input-container").style.display = "flex";
};

const showGossips = () => {
  const gossips = (document.getElementById("gossips").style.display = "block");
  hideMenu();
};

const showVocabulary = () => {
  document.getElementById("vocabulary").style.display = "block";
  hideMenu();
};
// #endregion

// #region cursor blink
let cursorBlink = true;
const cursor = document.getElementById("cursor");
setInterval(() => {
  if (cursorBlink) cursor.style.background = "#a5a2b2";
  else cursor.style.background = "#000";
  cursorBlink = !cursorBlink;
}, 500);
// #endregion

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.key))
    e.preventDefault();

  if (!menu) {
    menu = true;
    e.preventDefault();
    showMenu();
    document.getElementById("vocabulary").style.display = "none";
    document.getElementById("gossips").style.display = "none";
    document.getElementById("input").focus();
  } else if (e.key == "Enter") {
    cursor.style.left = "200px";
    const input = document.getElementById("input");
    const val = input.value.toUpperCase();
    input.value = "";

    if (menu) {
      if (val == "WEST" || val == "W") player.go("west");
      else if (val == "EAST" || val == "E") player.go("east");
      else if (val == "NORTH" || val == "N") player.go("north");
      else if (val == "SOUTH" || val == "S") player.go("south");
      else if (val.startsWith("T ")) player.take(val.replace("T ", ""));
      else if (val.startsWith("TAKE ")) player.take(val.replace("TAKE ", ""));
      else if (val.startsWith("D ")) player.drop(val.replace("D ", ""));
      else if (val.startsWith("DROP ")) player.drop(val.replace("DROP ", ""));
      else if (val.startsWith("U ")) player.use(val.replace("U ", ""));
      else if (val.startsWith("USE ")) player.use(val.replace("USE ", ""));
      else if (val == "G" || val == "GOSSIPS") {
        showGossips();
        menu = false;
      } else if (val == "V" || val == "VOCABULARY") {
        showVocabulary();
        menu = false;
      } else
        document.getElementById("message").textContent =
          "Try another word or V for vocabulary";
    }
  }
});

const start = () => {
  const image = document.getElementById("intro-image");
  setTimeout(() => {
    image.src = "./assets/img/opis_A.jpg";
    setTimeout(() => {
      image.src = "./assets/img/opis_B.jpg";
      setTimeout(() => {
        document.getElementById("introduction").remove();
        document.getElementById("game").style.display = "block";
        document.getElementById("input").focus();
      }, 18000);
    }, 18000);
  }, 6000);
};

start();
