const getRandomInt = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

const getRandomEl = (arr) => {
  const element = getRandomInt(8);
  if (arr.length == 0) return element;
  else {
    let elementsInArray = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == element) elementsInArray++;
    }
    if (elementsInArray < 2) return element;
    else return getRandomEl(arr);
  }
};

const getIndexes = () => {
  // randomly set images map
  const arr = [];
  for (let i = 0; i < 16; i++) arr.push(getRandomEl(arr));
  return arr;
};

const generateGame = (time) => {
  // create images
  const container = document.querySelector("#container");
  for (let i = 0; i < 16; i++) {
    const img = document.createElement("img");
    img.src = "./img/0.jpg";
    img.draggable = false;
    container.append(img);
  }

  // add on click listeners
  addListeners();

  // for first click - start game
  const containerEvent = () => {
    const startTime = Date.now();
    moveClock(startTime, time);
    container.removeEventListener("click", containerEvent);
  };
  container.addEventListener("click", containerEvent);
};

let matched = [];

const addListeners = () => {
  const imgs = document.querySelectorAll("img");
  const indexes = getIndexes();
  let canClick = true;
  let chosenElementIndex = null;

  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];

    img.addEventListener("click", () => {
      // isn't matched, not click 3 elements in 1 move, not click the same element
      if (!matched.includes(i) && canClick && chosenElementIndex != i) {
        if (chosenElementIndex == null) {
          chosenElementIndex = i;
          img.src = `./img/${indexes[i - 1]}.jpg`;
        } else {
          if (
            chosenElementIndex != i &&
            indexes[chosenElementIndex - 1] == indexes[i - 1]
          ) {
            // match
            img.src = `./img/${indexes[i - 1]}.jpg`;
            matched.push(i);
            matched.push(chosenElementIndex);
            chosenElementIndex = null;

            (() =>
              setTimeout(() => {
                if (matched.length == 16) endGame("win");
              }, 100))();
          } else {
            // not matched
            img.src = `./img/${indexes[i - 1]}.jpg`;
            canClick = false;

            (() =>
              setTimeout(() => {
                img.src = "./img/0.jpg";
                imgs[chosenElementIndex].src = "./img/0.jpg";
                chosenElementIndex = null;
                canClick = true;
              }, 500))();
          }
        }
      }
    });
  }
};

const moveClock = (startTime, maxTime) => {
  // set clock width as percentage of remaining time
  const clock = document.querySelector("#clock-time");
  clock.style.width = `${
    (parseInt(Date.now() - startTime) / (maxTime * 1000)) *
    document.querySelector("#clock").offsetWidth
  }px`;

  // get integer value of remaining time
  const timer = (maxTime * 1000 - (Date.now() - startTime)).toString();

  // correct clock text aligning (works only for values 100000ms or less)
  const clockText = document.querySelector("#clock-text");
  clockText
    ? (clockText.textContent =
        timer > 69999
          ? `00:0${parseInt(timer / 60000)}.${
              timer.substring(0, 2) - 60
            }:${timer.substring(2, 5)}`
          : timer > 59999
          ? `00:0${parseInt(timer / 60000)}.0${
              timer.substring(0, 2) - 60
            }:${timer.substring(2, 5)}`
          : timer > 9999
          ? `00:${timer.substring(0, 2)}.${timer.substring(2, 5)}`
          : timer > 999
          ? `00:0${timer.substring(0, 1)}.${timer.substring(1, 4)}`
          : timer > 99
          ? `00:00.0${timer.substring(1, 3)}`
          : timer > 9
          ? `00:00.0${timer}`
          : `00:00.00${timer}`)
    : "";

  if (Date.now() - startTime < maxTime * 1000) {
    if (clockText) setTimeout(`moveClock(${startTime}, ${maxTime})`, 10);
  } else endGame("lose");
};

const endGame = (gameState) => {
  // get all imgs within a first element (html map img)
  const imgs = [];
  const allImgs = document.querySelectorAll("img");
  for (value of Object.values(allImgs)) {
    if (value != Object.values(allImgs)[0]) imgs.push(value);
  }

  // for opacity animation
  for (let i = 0; i < imgs.length; i++) imgs[i].style.opacity = 0;
  document.querySelector("#clock").style.opacity = 0;
  document.querySelector("#game-title").style.opacity = 0;

  if (gameState == "win") {
    // remove old text timer and create new (stop clock interval)
    const timer = document.querySelector("#clock-text");
    timer.remove();
    const newTimer = document.createElement("p");
    newTimer.textContent = timer;
    newTimer.id = "clock-text";

    // set timer width as old
    const time = document.querySelector("#clock-time");
    const width = time.style.width;

    setTimeout(() => {
      document.querySelector("#clock").append(timer);
      document.querySelector("#clock-time").style.width = width;
    }, 20);

    // set up data for win alert
    document.querySelector("#game-type").textContent = document.title;
    document.querySelector("#game-time").textContent = timer.textContent;

    setTimeout(() => {
      // remove game elements and show alert
      for (let i = 0; i < imgs.length; i++) imgs[i].remove();
      document.querySelector("#clock-text").remove();
      document.querySelector("#clock").style.display = "none";
      document.querySelector("#game-title").style.display = "none";
      document.querySelector("#win-alert").style.display = "block";
    }, 2500);
  } else if (gameState == "lose") {
    matched = [];
    document.querySelector("#clock-text").textContent = "00:00.000";
    document.querySelector("#lose-game-type").textContent = document.title;

    setTimeout(() => {
      // remove game elements and show alert
      for (let i = 0; i < imgs.length; i++) imgs[i].remove();
      document.querySelector("#clock-text").remove();
      document.querySelector("#clock").style.display = "none";
      document.querySelector("#game-title").style.display = "none";
      document.querySelector("#lose-alert").style.display = "block";
    }, 2500);
  }
};

startGame = (time) => {
  // set game title
  document.title = `MEMORY ${time}s`;
  const gameType = document.querySelector("#game-title");
  gameType.style.opacity = 100;
  gameType.style.display = "block";
  gameType.textContent = `MEMORY ${time}s`;

  // for right displaying
  document.querySelector("#map-img").style.display = "none";
  document.querySelector("#buttons").style.display = "none";
  const clock = document.querySelector("#clock");
  clock.style.opacity = 100;
  clock.style.display = "flex";

  // set start clock text value
  const minutes = parseInt(time / 60) > 0 ? parseInt(time / 60).toString() : "";
  const seconds = time % 60 == 0 ? "00" : (time % 60).toString();
  const clockText = document.createElement("p");
  clockText.id = "clock-text";
  clockText.textContent = `0${minutes == 1 ? minutes : "0:"}${
    minutes > 0 ? ":" : ""
  }${seconds}.000`;
  clock.append(clockText);

  // add clock's child for right displaying
  const clockTime = document.createElement("div");
  clockTime.id = "clock-time";
  clock.append(clockTime);

  // generate map
  generateGame(time);
};

const playNewGame = () => {
  // clear matched array, display right elements
  matched = [];
  document.title = "MEMORY";
  document.querySelector("#map-img").style.display = "block";
  document.querySelector("#buttons").style.display = "grid";
  document.querySelector("#win-alert").style.display = "none";
  document.querySelector("#lose-alert").style.display = "none";
};

// add data to existing cookie's array
const setGameplaysCookie = (data, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const cookies = document.cookie;
  if (cookies) {
    let gameplays = [];
    cookies.split(";").map((el) => {
      if (el.includes("gameplays"))
        gameplays = JSON.parse(el.replace("gameplays=", ""));
    });
    document.cookie = `gameplays=${JSON.stringify([
      ...gameplays,
      data,
    ])};expires=${d.toUTCString()};path=/`;
  } else {
    document.cookie = `gameplays=${JSON.stringify([
      data,
    ])};expires=${d.toUTCString()};path=/`;
  }
};

// get games cookie data
const getGameplaysCookie = () => {
  const cookies = document.cookie;
  let array = [];
  if (cookies) {
    cookies.split(";").forEach((el) => {
      if (el.includes("gameplays"))
        array = JSON.parse(el.replace("gameplays=", ""));
    });
    return array;
  }
  return [];
};

// clear cookies
const clearCookies = () => {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// for displaying top 10
const sortGameplays = (mode) => {
  const gameplays = getGameplaysCookie();

  switch (mode) {
    // sort data for only one mode
    case "30s":
    case "60s":
    case "90s":
      let _gameplays = [];
      gameplays.forEach((el) => {
        if (mode == el.mode) _gameplays.push(el);
      });

      return _gameplays.sort((a, b) => {
        const aValue =
          parseInt(a.time.slice(0, 2)) * 60000 +
          parseInt(a.time.slice(3, 5)) * 1000 +
          parseInt(a.time.slice(6, 9));
        const bValue =
          parseInt(b.time.slice(0, 2)) * 60000 +
          parseInt(b.time.slice(3, 5)) * 1000 +
          parseInt(b.time.slice(6, 9));
        return bValue - aValue;
      });

    // sort data by time amount from start to win
    // faster = higher place
    case "":
      return gameplays.sort((a, b) => {
        const aValue =
          parseInt(a.mode.replace("s", "")) * 1000 -
          parseInt(a.time.slice(0, 2)) * 60000 -
          parseInt(a.time.slice(3, 5)) * 1000 -
          parseInt(a.time.slice(6, 9));
        const bValue =
          parseInt(b.mode.replace("s", "")) * 1000 -
          parseInt(b.time.slice(0, 2)) * 60000 -
          parseInt(b.time.slice(3, 5)) * 1000 -
          parseInt(b.time.slice(6, 9));

        return aValue - bValue;
      });
  }
};

// dialog after winning a game
const submitData = () => {
  const input = document.querySelector("#win-input");
  const time = document.querySelector("#game-time").textContent;

  if (!input.value) {
    input.style.border = "2px solid red";
    input.style.animation = "horizontal-shaking 500ms ease-in-out";
    input.placeholder = "nie podano nicku";
  } else {
    setGameplaysCookie(
      {
        nickname: encodeURIComponent(input.value),
        time: time,
        mode: document.title.replace("MEMORY ", ""),
      },
      30
    );

    input.style.border = "1px solid gray";
    input.style.animation = "none";
    input.placeholder = "";
    input.value = "";

    playNewGame();
  }
};

const top10 = (mode) => {
  const sortedData = sortGameplays(mode);
  const ranking = document.querySelector("#ranking");
  const mapImg = document.querySelector("#map-img");
  const buttons = document.querySelector("#buttons");

  mapImg.style.display = "none";
  buttons.style.display = "none";
  ranking.style.display = "block";

  const h1 = document.createElement("h1");
  h1.textContent = `top 10 ${mode ? `(${mode})` : ""}`;
  ranking.append(h1);

  if (sortedData.length == 0) {
    const message = document.createElement("p");
    message.textContent = "Brak gier dla danego typu.";
    ranking.append(message);
  } else {
    const ol = document.createElement("ol");

    sortedData.slice(0, 10).forEach((el) => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      const nick = document.createElement("p");
      nick.textContent = decodeURIComponent(el.nickname);

      const time = document.createElement("p");
      time.textContent = el.time;

      div.className = "player-data";
      div.append(nick);
      div.append(time);
      li.append(div);
      ol.append(li);
    });

    ranking.append(ol);
  }

  const button = document.createElement("button");
  button.textContent = "powrót";
  button.onclick = () => {
    mapImg.style.display = "block";
    buttons.style.display = "grid";
    ranking.innerHTML = "";
    ranking.style.display = "none";
  };
  ranking.append(button);
};
