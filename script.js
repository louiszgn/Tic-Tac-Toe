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
let player1 = "";
let player2 = "";
let size = 3;
let isInGame = false;
const menuContent = document.querySelector("#menu-content");
const gameContent = document.querySelector("#game-content");

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
  if (((multi && (player1Input.value.lenght > 1) && (player2Input.value.lenght > 1))|| (!multi && (player1Input.value.lenght > 1))) && (sizeRange.value >= 3)) {
    player1 = player1Input.value;
    player2 = player2Input.value;
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
/*********** End Onload ***********/