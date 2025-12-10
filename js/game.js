//Variables declaration
const cards = document.querySelectorAll(".card");
const time = document.getElementById("time");
const moves = document.getElementById("moves");
const dialogWindow = document.querySelector(".dialogWindow");
const won = document.querySelector(".won");
const personWon = document.getElementById("personWon");
const wonText = document.getElementById("wonMessage");
const timesUp = document.querySelector(".timesUp");
const player1Label = document.getElementById("p1");
const player2Label = document.getElementById("p2");
const player1Score = document.getElementById("p1Score");
const player2Score = document.getElementById("p2Score");
const playerLabel = document.getElementById("pl");
const computerLabel = document.getElementById("comp");
const player = document.getElementById("player");
const computer = document.getElementById("computer");
const playerScore = document.getElementById("playerScore");
const computerScore = document.getElementById("computerScore");
const flipSound = new Audio('../sound/Flip.mp3');
const failSound = new Audio('../sound/Fail.mp3');
const tickSound = new Audio('../sound/Ticking.mp3');
const winSound = new Audio('../sound/Won.mp3');
let gameMode = localStorage.getItem("gameMode");


//Array with 8 icon paths
const cardBackImages = [
    "../icons/AppleIcon.svg",
    "../icons/PearIcon.svg",
    "../icons/WatermelonIcon.svg",
    "../icons/OrangeIcon.svg",
    "../icons/StrawberryIcon.svg",
    "../icons/PineappleIcon.svg",
    "../icons/CherriesIcon.svg",
    "../icons/BananaIcon.svg",
];

//Making new array with pair of each icon
const pairedImages = [...cardBackImages, ...cardBackImages];


let card1 = null, card2 = null;
let lockBoard = false, turn = false;
let movesCounter = 0, minutes = 1, seconds = 30, timer = null;
let p1Score = 0, p2Score = 0, plScore = 0; compScore = 0;
let computerMemory = [];
let memoryLimit = 5;
let computerThinkingTimeout = null;

//Event listener for loading shuffled cards on page load
window.addEventListener('DOMContentLoaded', () => {
  setMode();
  setCards();
});

//Setting click event listener on every card
cards.forEach(card => {
    card.addEventListener('click', () => {
       if(lockBoard) return;
       if(card === card1 || card.classList.contains("flipped")) return;
       
       if(gameMode === "singleplayer" && !timer){
         timer = setInterval(updateTime, 1000);
       }
       flippingSound();
       card.classList.add("flipped");

       if(gameMode === "singleplayer"){
         movesCounter++;
         displayMoves();
       } 

       if(!card1) {
        card1 = card;
       }
       else{
        card2 = card;
        checkMatch();
       }
       
       if(gameMode === "computer") rememberCard(card);
    });
});

//Checking if two cards are matching
function checkMatch(){
    const img1 = card1.querySelector(".cardBack img").src;
    const img2 = card2.querySelector(".cardBack img").src;

    if(img1 === img2){
      resetBoard();  //Leave them flipped if they are
      if(gameMode === "multiplayer"){
        if(turn) p2Score++;
        else p1Score++;
      }else if(gameMode === "computer"){
        if(turn) compScore++;
        else plScore++;
      }
      displayScore();
      setTimeout(checkWin, 700);
    }
    else{
      lockBoard = true;  //Prevent input temporary
      setTimeout(() => {
        card1.classList.remove("flipped");  //Flip cards back after 1.5s
        card2.classList.remove("flipped");
        flippingSound();
        resetBoard();
        if(gameMode === "multiplayer"){
          turn = !turn;
          player1Label.classList.toggle("redText");
          player2Label.classList.toggle("redText");
        }else if(gameMode === "computer"){
          turn = !turn;
          if(!turn) lockBoard = false;
          else startComputerTurn();
          playerLabel.classList.toggle("redText");
          computerLabel.classList.toggle("redText");
        }
      }, ((gameMode === "computer" && turn) ? 800 : 1700));
    }
}

//Reseting board values
function resetBoard(){
    [card1, card2] = [null, null];
    if(gameMode == "computer" && turn) lockBoard = true;
    else lockBoard = false;
}

//Function for reseting game
function resetGame(){
  clearInterval(timer);
  timer = null;
  minutes = 1;
  seconds = 30;
  movesCounter = 0;
  p1Score = 0;
  p2Score = 0;
  plScore = 0;
  compScore = 0;
  turn = false;
  lockBoard = false;
  wonText.textContent = "WON!";
  personWon.style.display = "block";
  personWon.style.fontSize = "clamp(2rem, 4.5vw, 10rem)";
  player1Label.classList.add("redText");
  playerLabel.classList.add("redText");
  player2Label.classList.remove("redText");
  computerLabel.classList.remove("redText");
  time.style.color = "#FFFFFF";

  displayTime();
  displayMoves();
  displayScore();
  clearComputerMemory();
  tickSound.pause();
  
  cards.forEach((card) => {
      card.classList.remove("flipped");
  })
    
  setTimeout(setCards, 700);
  resetBoard();
}

//Function for updating time every second
function updateTime(){
  if(seconds > 0){
    seconds--;
  }else if(minutes > 0){
    minutes--;
    seconds = 59;
  }

  displayTime();

  //If 5 seconds left
  if(minutes === 0 && seconds === 5){
    time.style.color = "#F44336";
    tickingSound();
  }
  //If time is up
  else if(minutes === 0 && seconds === 0) {
    clearInterval(timer);
    timesUpMessage();  //Show time's up popup
    tickSound.pause();
    failureSound();
  }
}

//Displaying time formated
function displayTime(){
  let displayMinutes = 
  (minutes < 10)? ("0" + minutes + ":") : (minutes + ":");

  let displaySeconds = 
  (seconds < 10) ? ("0" + seconds) : seconds;

  time.textContent = displayMinutes + displaySeconds;
}

//Displaying number of moves for singleplayer
function displayMoves(){
  moves.textContent = movesCounter;
}

function displayScore(){
  if(gameMode === "multiplayer"){
    player1Score.textContent = p1Score;
    player2Score.textContent = p2Score;
  }else if(gameMode === "computer"){
    playerScore.textContent = plScore;
    computerScore.textContent = compScore;
  }
}

//Fisher-Yates algorithm for shuffling array randomly
function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//Method for setting random card background images
function setCards(){
  const shuffledImages = shuffle(pairedImages);

  cards.forEach((card, index) => {
    const img = card.querySelector(".cardBack img");
    img.src = shuffledImages[index];
  })
}

//Function for setting game mode
function setMode(){
  document.body.classList.remove("singleplayerMode", "multiplayerMode", "computerMode");
  document.body.classList.add(`${gameMode}Mode`);
}

//Playing flip sound
function flippingSound(){
  flipSound.currentTime = 0;
  flipSound.play();
}

function tickingSound(){
  tickSound.currentTime = 0;
  tickSound.play();
}

function failureSound(){
  tickSound.pause();
  failSound.currentTime = 0;
  failSound.play();
}

function wonSound(){
  tickSound.pause();
  winSound.currentTime = 0;
  winSound.play();
}

//Method for showing won dialog
function wonMessage(){
  dialogWindow.style.display = "block";
  won.style.display = "flex";
}

//Method for closing won dialog
function wonOK(){
  won.style.display = "none";
  dialogWindow.style.display = "none";
  resetGame();
}

//Method for showing time's up dialog
function timesUpMessage(){
  dialogWindow.style.display = "block";
  timesUp.style.display = "flex";
}

//Method for closing time's up dialog
function timesUpOK(){
  timesUp.style.display = "none";
  dialogWindow.style.display = "none";
  resetGame();
}

//Method for checking if all cards are flipped
function checkWin(){
  //Check if they contain class flipped 
  const allFlipped = [...cards].every(card => card.classList.contains("flipped"));

  if(allFlipped && gameMode === "singleplayer"){
    clearInterval(timer);
    personWon.textContent = "YOU";
    wonMessage();  //Display popup
    wonSound();
  }
  else if(allFlipped && gameMode === "multiplayer"){
    personWon.style.fontSize = "clamp(1.5rem, 4vw, 10rem)";
    if(p1Score > p2Score) personWon.textContent = "PLAYER 1";
    else if(p2Score > p1Score) personWon.textContent = "PLAYER 2";
    else{
      personWon.style.display = "none";
      wonText.textContent = "DRAW";
    }
    wonMessage();  //Display popup
    wonSound();
  }
  else if(allFlipped && gameMode === "computer"){
    personWon.style.fontSize = "clamp(1.5rem, 4vw, 10rem)";
    if(plScore > compScore) personWon.textContent = "PLAYER";
    else if(compScore > plScore) personWon.textContent = "COMPUTER";
    else{
      personWon.style.display = "none";
      wonText.textContent = "DRAW";
    }
    wonMessage();  //Display popup
    wonSound();
  }

}

function computerPlay(){
    const forgetChance = 0.05;
    //18 percent chance for computer to forget card from memory
    if(Math.random() < forgetChance && computerMemory.length > 0){
        const idx = Math.floor(Math.random() * computerMemory.length);
        computerMemory.splice(idx, 1);
    }

    let knownPair = findKnownPair();

    if(knownPair){
        const [cA, cB] = knownPair;
        flipComputerCard(cA);
        setTimeout(() => {
            flipComputerCard(cB);
            setTimeout(() => {
                checkMatch();
                  setTimeout(() => {
                    if(turn){
                      const nextDelay = 600 + Math.random() * 900;
                      computerThinkingTimeout = setTimeout(computerPlay, nextDelay);
                    }
                  }, 750);
            }, 750);
        }, 700);
    }else{
        const first = getRandomUnflippedCard();
        if(!first){
            lockBoard = false;
            return;
        }
        flipComputerCard(first);

        setTimeout(() => {
            const firstImg = first.querySelector(".cardBack img").src;
            const memoryMatch = 
            computerMemory.find(e => e.img === firstImg && e.card !== first && 
            !e.card.classList.contains("flipped"));

            let second;
            if(memoryMatch) second = memoryMatch.card;
            else second = getRandomUnflippedCard(first);

            if(!second){
                lockBoard = false;
                return;
            }
            flipComputerCard(second);

            setTimeout(() => {
                checkMatch();
                setTimeout(() => {
                  if(turn){
                    const nextDelay = 700 + Math.random() * 900;
                    computerThinkingTimeout = setTimeout(computerPlay, nextDelay);
                  }
                }, 800);
            }, 750);
        }, 700);
    }
}

//Method for searching for a pair in memory
function findKnownPair(){
    purgeMatchedFromMemory();
    for(let i = 0; i < computerMemory.length; i++){
        for(let j = i+1; j < computerMemory.length; j++){
            if(computerMemory[i].img === computerMemory[j].img)
                return [computerMemory[i].card, computerMemory[j].card];
        }
    }
    return null;
}

//Method for removing matched cards from memory
function purgeMatchedFromMemory(){
    computerMemory = computerMemory.filter(e => !e.card.classList.contains("flipped"));
}

//Method for flipping card programatically
function flipComputerCard(card){
    if(!card || card.classList.contains("flipped")) return;
    flippingSound();
    card.classList.add("flipped");

    if(!card1){
        card1 = card;
    }else if(!card2 && card !== card1){
        card2 = card;
    }

    rememberCard(card);
}

//Method for storing flipped cards in memory
function rememberCard(card){
    const img = card.querySelector(".cardBack img").src;
    if(computerMemory.some(e => e.card === card)) return;
    computerMemory.push({card, img});
    if(computerMemory.length > memoryLimit) computerMemory.shift();
}

//Method for randomly flipping card
function getRandomUnflippedCard(excludeCard){
    const unflipped = 
    [...cards].filter(c => !c.classList.contains("flipped") && c !== excludeCard);
    
    if(unflipped.length === 0) return null;
    return unflipped[Math.floor(Math.random() * unflipped.length)];
}

//Method for reseting computer memory
function clearComputerMemory(){
    computerMemory = [];
    if(computerThinkingTimeout){
        clearTimeout(computerThinkingTimeout);
        computerThinkingTimeout = null;
    }
}

//Method for starting computer play
function startComputerTurn(){
    lockBoard = true;
    const thinkTime = 800 + Math.random() * 1200;
    computerThinkingTimeout = setTimeout(() => {
        computerThinkingTimeout = null;
        computerPlay();
    }, thinkTime);
}