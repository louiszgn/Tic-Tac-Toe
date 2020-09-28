// IA
// fc checkLine
// fc checkColumn
// get count of case complete by player

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

function removeCookies(name = null) {
  if (name) document.cookie = `${name} =; expires = Thu, 01 Jan 1970 00:00:00 UTC`;
  else {
    let multiple = document.cookie.split(";");
    for(cookie of multiple) {
      let key = cookie.split("=");
      document.cookie = `${key[0]} =; expires = Thu, 01 Jan 1970 00:00:00 UTC`;
    }
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

document.querySelector("#leaderboard .clear").onclick = () => {
  localStorage.clear();
  table.innerHTML = "<tr><th>Name</th><th>Score</th></tr>";
};

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
  multi = true;
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
    setCookie("activePlayer", 1);

    checkIsInGame();
  }
  else alert("Not all information is filled in correctly");
}
/*********** End Menu ***********/

/*********** Game ***********/
let nbCompleteCells = 0;
let completeCells = [];
const player1Name = document.querySelector("#game-content .players .player-1");
const player2Name = document.querySelector("#game-content .players .player-2");
const grid = document.querySelector("#game-content .grid");
const popupWin = document.querySelector("#popup-win");

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
  multi = (getCookie("multi") === "true") ? true : false;
  let size = getCookie("size");
  style.setProperty('--grid-size', size);
  style.setProperty('--grid-size-px', size + "px");
  player1Name.querySelector("span").innerHTML = getCookie("player1");
  player2Name.querySelector("span").innerHTML = getCookie("player2");

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = document.createElement("DIV");
      cell.classList.add(`c${i}-${j}`);
      grid.appendChild(cell);

      cell.onclick = () => {
        if (cell.classList.contains("played")) return;
        let thisCell = cell.classList.value;

        nbCompleteCells++;
        completeCells.push({cell: thisCell, player: getCookie("activePlayer")});
        cell.classList.add("played");

        if (getCookie("activePlayer") == 1) cell.classList.add("player1");
        else cell.classList.add("player2");

        checkWin(thisCell);
        switchPlayer();
      }
    }
  }
  cellsSize();

  if (getCookie("activePlayer") == 1) player1Name.classList.add("active");
  else player2Name.classList.add("active");
}

function cellsSize() {
  let cells = grid.querySelectorAll("div");
  for (let cell of cells) cell.style.height = cell.offsetWidth;
}

function switchPlayer() {
  if (getCookie("activePlayer") == 1) {
    setCookie("activePlayer", 2);
    player2Name.classList.add("active");
    player1Name.classList.remove("active");

    if (!multi) player2AI();
  }
  else {
    setCookie("activePlayer", 1);
    player1Name.classList.add("active");
    player2Name.classList.remove("active");
  }
}

function player2AI() {
  let size = parseInt(getCookie("size"));
  let cell = grid.querySelector(`.c${Math.floor(Math.random() * size)}-${Math.floor(Math.random() * size)}`);

  if (cell.classList.contains("played")) player2AI();
  else setTimeout(() => {cell.click();}, 1000);
}

function checkSuite(line, column, thisCell) {
  let ee = completeCells.find(cell => cell.cell === `c${line}-${column}` && cell.player === getCookie("activePlayer")) || false;
  if (ee && ee.cell != thisCell) return true;
  else return false;
}

function checkCell(thisCell, l, c) {
  let checkedCell = completeCells.find(cell => cell.cell === `c${l}-${c}` && cell.player === getCookie("activePlayer"));
  if (checkedCell && (checkedCell.cell != thisCell)) {
    let newLine = parseInt(thisCell.split("")[1]);
    let newColumn = parseInt(thisCell.split("")[3]);
    
    if (newLine > l) {
      if (newColumn > c)
      {
        if (checkSuite(newLine + 1, newColumn + 1, thisCell)) return endGame();
        if (checkSuite(l - 1, c - 1, thisCell)) return endGame();
      }
      else if (newColumn < c)
      {
        if (checkSuite(newLine - 1, newColumn - 1, thisCell)) return endGame();
        if (checkSuite(l + 1, c + 1, thisCell)) return endGame();
      }
      else {
        if (checkSuite(newLine + 1, newColumn, thisCell)) return endGame();
        if (checkSuite(l - 1, c, thisCell)) return endGame();
      }
    }
    else if (newLine < l) {
      if (newColumn > c)
      {
        if (checkSuite(newLine - 1, newColumn + 1, thisCell)) return endGame();
        if (checkSuite(l + 1, c - 1, thisCell)) return endGame();
      }
      else if (newColumn < c)
      {
        if (checkSuite(newLine - 1, newColumn - 1, thisCell)) return endGame();
        if (checkSuite(l + 1, c + 1, thisCell)) return endGame();
      }
      else {
        if (checkSuite(newLine - 1, newColumn, thisCell)) return endGame();
        if (checkSuite(l + 1, c, thisCell)) return endGame();
      }
    }
    else {
      if (newColumn > c)
      {
        if (checkSuite(newLine, newColumn + 1, thisCell)) return endGame();
        if (checkSuite(l, c - 1, thisCell)) return endGame();
      }
      else if (newColumn < c)
      {
        if (checkSuite(newLine, newColumn - 1, thisCell)) return endGame();
        if (checkSuite(l, c + 1, thisCell)) return endGame();
      }
    }
  }
}

function checkColumn(thisCell, column, l) {
  if (column > 0) for (let c = (column - 1); c <= (column + 1); c++) checkCell(thisCell, l, c);
  else for (let c = column; c <= (column + 1); c++) checkCell(thisCell, l, c);
}

function checkWin(thisCell) {
  if (nbCompleteCells === 9) endGame();
  else {
    let line = parseInt(thisCell.split("")[1]);
    let column = parseInt(thisCell.split("")[3]);

    if(line > 0) for (let l = (line - 1); l <= (line + 1); l++) checkColumn(thisCell, column, l);
    else for (let l = line; l <= (line + 1); l++) checkColumn(thisCell, column, l);
  }
}

function endGame() {
  let winner = (getCookie("activePlayer") == 1) ? getCookie("player1") : getCookie("player2");
  if (nbCompleteCells != 9) pushToLeaderboard(winner);
  else winner = "Nobody";

  removeCookies("isInGame");
  setCookie("activePlayer", 1);
  completeCells = []; 
  nbCompleteCells = 0;

  document.querySelector("#popup-win .win-content span").innerHTML = winner;
  popupWin.classList.add("show");
}

document.querySelector("#popup-win .win-content .return").onclick = () => {
  grid.innerHTML = "";
  popupWin.classList.remove("show");
  checkIsInGame();
}

window.onresize = () => cellsSize();
/*********** End Game ***********/

/*********** Onload ***********/
setDatas();
checkIsInGame();

// Load the leaderboard
for (player of leaderboard) updateLeaderboard(player.name, player.score);
/*********** End Onload ***********/