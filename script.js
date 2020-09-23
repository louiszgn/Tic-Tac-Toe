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

// End of party
// Dans localstorage => nom de l'utilisateur + nombre de parties gagnées

let multi = true;
let player1 = "";
let player2 = "";
let size = 3;
let isInGame = false;

/*********** Menu ***********/
const select1 = document.querySelector("#menu-content .select-1");
const select2 = document.querySelector("#menu-content .select-2");
const player1Input = document.querySelector("#menu-content .player-1 input");
const player2Input = document.querySelector("#menu-content .player-2 input");
const sizeRange = document.querySelector("#menu-content .grid-size input");
const outputSizeRange = document.querySelector("#menu-content .grid-size span");
const start = document.querySelector("#menu-content .start-btn");

sizeRange.oninput = () => {
  outputSizeRange.innerHTML = sizeRange.value;
}
/*********** End Menu ***********/

/*********** Game ***********/

/*********** End Game ***********/

/*********** Onload ***********/
sizeRange.value = size; // reset
outputSizeRange.innerHTML = sizeRange.value;
/*********** End Onload ***********/