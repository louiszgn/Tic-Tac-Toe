// Create player1
// Create player2 (if not = bot)
// Select nb players (bind class && bind attr :disable)
// Create size selector (3 by default) // html range
// Create matrice of the game (adapt to the size)
// Create html of party
// Get onclick by case

// IA
// fc checkLine
// fc checkColumn
// get count of case complete by player 

// End of party
// Dans localstorage => nom de l'utilisateur + nombre de parties gagnées

let multi = true;
let style = document.documentElement.style;
let leaderboard = Object.keys(localStorage).map(key => { return {"name": key, "score": localStorage.getItem(key)} }).sort((a, b) => b.score - a.score);
const menuContent = document.querySelector("#menu-content");
const gameContent = document.querySelector("#game-content");

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  else return null;
}

function setCookie(name, data) {
  document.cookie = `${name}=${data}; SameSite=Strict`;
}

function removeCookies() {
  let res = document.cookie;
  let multiple = res.split(";");
  for(cookie of multiple) {
    let key = cookie.split("=");
    document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
  }
}

/*********** Leaderboard ***********/
const table = document.querySelector("#leaderboard .table");

function updateLeaderboard(name, score) {
  let position = (leaderboard.filter(player => parseInt(player.score) > parseInt(score)).length + 1) || 1;

  let newRow = table.insertRow(position);
  newRow.insertCell(0).appendChild(document.createTextNode(name));
  newRow.insertCell(1).appendChild(document.createTextNode(score));
}

function pushToLeaderboard(name) {
  if (localStorage.getItem(name)) {
    let playerScore = parseInt(localStorage.getItem(name)) + 1;

    localStorage.removeItem(name);
    localStorage.setItem(name, playerScore);
    leaderboard.find(player => player.name === name).score++;

    table.querySelectorAll("tr").forEach(tr => {
      if(tr.innerHTML.includes("<td>"+name+"</td>")) tr.innerHTML = "<td>"+name+"</td><td>"+playerScore+"</td>";
    });
  }
  else {
    localStorage.setItem(name, "1");
    leaderboard.push({"name": name, "score": 1});
    updateLeaderboard(name, 1);
  }
}

document.querySelector("#header .leaderboard-btn").onclick = () => document.querySelector("#leaderboard").classList.toggle("show");
document.querySelector("#leaderboard .close").onclick = () => document.querySelector("#leaderboard").classList.toggle("show");
/*********** End Leaderboard ***********/

/*********** Menu ***********/
const select1 = document.querySelector("#menu-content .select-1");
const select2 = document.querySelector("#menu-content .select-2");
const player1Input = document.querySelector("#menu-content .player-1 input");
const player2Input = document.querySelector("#menu-content .player-2 input");
const sizeRange = document.querySelector("#menu-content .grid-size input");
const outputSizeRange = document.querySelector("#menu-content .grid-size span");

function setDatas() {
  if (multi) select2.click();
  else select1.click();

  player1Input.value = getCookie("player1") || "";
  player2Input.value = getCookie("player2") || "";
  sizeRange.value = getCookie("size") || 3;
  outputSizeRange.innerHTML = sizeRange.value;
}

document.querySelector("#menu-content .reset-btn").onclick = () => {
  removeCookies();
  setDatas();
}

select1.onclick = () => {
  multi = false;
  select1.classList.add("active");
  select2.classList.remove("active");
  player2Input.disabled = true;
}

select2.onclick = () => {
  multi = true;
  select2.classList.add("active");
  select1.classList.remove("active");
  player2Input.disabled = false;
}

sizeRange.oninput = () => outputSizeRange.innerHTML = sizeRange.value;

document.querySelector("#menu-content .start-btn").onclick = () => {
  if (((multi && (player1Input.value.length > 1) && (player2Input.value.length > 1)) || (!multi && (player1Input.value.length > 1))) && (sizeRange.value >= 3)) {
    if (multi) setCookie("player2", player2Input.value);
    else setCookie("player2", "LeBot");
    
    setCookie("multi", multi);
    setCookie("player1", player1Input.value);
    setCookie("size", sizeRange.value);
    setCookie("isInGame", "true");

    checkIsInGame();
  }
  else alert("Not all information is filled in correctly");
}
/*********** End Menu ***********/

/*********** Game ***********/
const player1Name = document.querySelector("#game-content .players .player-1");
const player2Name = document.querySelector("#game-content .players .player-2");
const grid = document.querySelector("#game-content .grid");

function checkIsInGame() {
  if (getCookie("isInGame")) {
    gameContent.classList.add("show");
    menuContent.classList.remove("show");

    gameInit();
  }
  else {
    menuContent.classList.add("show");
    gameContent.classList.remove("show");
  }
}

function gameInit() {
  multi = getCookie("multi");
  let size = getCookie("size");
  style.setProperty('--grid-size', size);
  style.setProperty('--grid-size-px', size + "px");
  player1Name.querySelector("span").innerHTML = getCookie("player1");
  player2Name.querySelector("span").innerHTML = getCookie("player2");

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j ++) {
      let cell = document.createElement("DIV");
      cell.classList.add(`${i}-${j}`);
      grid.appendChild(cell);
    }
  }

  cellsSize();
}

function cellsSize() {
  let cells = grid.querySelectorAll("div");
  for (let cell of cells) cell.style.height = cell.offsetWidth;
}

window.onresize = () => cellsSize();
/*********** End Game ***********/

/*********** Onload ***********/
setDatas();
checkIsInGame();

// Load the leaderboard
for (player of leaderboard) updateLeaderboard(player.name, player.score);
/*********** End Onload ***********/