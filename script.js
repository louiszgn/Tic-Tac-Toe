// Create player1
// Create player2 (if not = bot)
// Select nb players (bind class && bind attr :disable)
// Create size selector (3 by default) // html range
// Create matrice of the game (adapt to the size)
// Create html of party
// Get onclick by case
localStorage.setItem('azdqsdq', '9');
localStorage.setItem('dqsdz', '3');
localStorage.setItem('Tom', '2');
localStorage.setItem('efsdfsd', '40');
localStorage.setItem('Tofdfm', '20');
// IA
// fc checkLine
// fc checkColumn
// get count of case complete by player 

// End of party
// Dans localstorage => nom de l'utilisateur + nombre de parties gagnées

let multi = true;
let player1 = "";
let player2 = "";
let size = 3;
let isInGame = false;
let leaderboard = Object.keys(localStorage).map(key => { return {"name": key, "score": localStorage.getItem(key)} }).sort((a, b) => b.score - a.score);
const menuContent = document.querySelector("#menu-content");
const gameContent = document.querySelector("#game-content");

/*********** Leaderboard ***********/
const table = document.querySelector("#leaderboard .table");

function updateLeaderboard(name, score) {
  let position = (leaderboard.filter(player => parseInt(player.score) > parseInt(score)).length + 1) || 1;

  let newRow = table.insertRow(position);
  newRow.insertCell(0).appendChild(document.createTextNode(name));
  newRow.insertCell(1).appendChild(document.createTextNode(score));
}

function pushToLeaderboard(name) {
  // push to localstorage
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
const reset = document.querySelector("#menu-content .reset-btn");
const select1 = document.querySelector("#menu-content .select-1");
const select2 = document.querySelector("#menu-content .select-2");
const player1Input = document.querySelector("#menu-content .player-1 input");
const player2Input = document.querySelector("#menu-content .player-2 input");
const sizeRange = document.querySelector("#menu-content .grid-size input");
const outputSizeRange = document.querySelector("#menu-content .grid-size span");
const start = document.querySelector("#menu-content .start-btn");

function setDatas() {
  if (multi) select2.click();
  else select1.click();

  player1Input.value = player1;
  player2Input.value = player2;
  sizeRange.value = size;
  outputSizeRange.innerHTML = sizeRange.value;
}

reset.onclick = () => {
  multi = true;
  player1 = "";
  player2 = "";
  size = 3;

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

sizeRange.oninput = () => {
  outputSizeRange.innerHTML = sizeRange.value;
}

start.onclick = () => {
  if (((multi && (player1Input.value.lenght > 1) && (player2Input.value.lenght > 1)) || (!multi && (player1Input.value.lenght > 1))) && (sizeRange.value >= 3)) {
    if (multi) player2 = player2Input.value;
    else player2 = "TheBot";
    
    player1 = player1Input.value;
    size = sizeRange.value;
    isInGame = true;

    checkIsInGame();
  }
  else alert("Not all information is filled in correctly");
}
/*********** End Menu ***********/

/*********** Game ***********/
function checkIsInGame() {
  if (isInGame) {
    gameContent.classList.add("show");
    menuContent.classList.remove("show");
  }
  else {
    menuContent.classList.add("show");
    gameContent.classList.remove("show");
  }
}
/*********** End Game ***********/

/*********** Onload ***********/
setDatas();
checkIsInGame();

// Load the leaderboard
for (player of leaderboard) updateLeaderboard(player.name, player.score);
/*********** End Onload ***********/