//Variables declaration
const cards = document.querySelectorAll(".card");
const time = document.getElementById("time");
const moves = document.getElementById("moves");

//Array with 8 icon paths
const cardBackImages = [
    "../icons/HeartIcon.svg",
    "../icons/CircleIcon.svg",
    "../icons/SquareIcon.svg",
    "../icons/HexagonIcon.svg",
    "../icons/StarIcon.svg",
    "../icons/TriangleIcon.svg",
    "../icons/SealIcon.svg",
    "../icons/DiamondIcon.svg",
];

//Making new array with pair of each icon
const pairedImages = [...cardBackImages, ...cardBackImages];


let card1 = null, card2 = null;
let lockBoard = false;
let movesCounter = 0, minutes = 3, seconds = 0, timer = null;

//Event listener for loading shuffled cards on page load
window.addEventListener('DOMContentLoaded', setCards());

cards.forEach(card => {
    card.addEventListener('click', () => {
       if(lockBoard) return;
       if(card === card1 || card.classList.contains("flipped")) return;

       if(!timer) timer = setInterval(updateTime, 1000);
       card.classList.add("flipped");
       movesCounter++;
       displayMoves();

       if(!card1) {
        card1 = card;
       }
       else{
        card2 = card;
        checkMatch();
       }
    });
});

//Checking if two cards are matching
function checkMatch(){
    const img1 = card1.querySelector(".cardBack img").src;
    const img2 = card2.querySelector(".cardBack img").src;

    if(img1 === img2){
      resetBoard();  //Leave them flipped if they are
    }
    else{
      lockBoard = true;  //Prevent input temporary
      setTimeout(() => {
        card1.classList.remove("flipped");  //Flip cards back after 1.5s
        card2.classList.remove("flipped");
        resetBoard();
      }, 1500);
    }
}

//Reseting board values
function resetBoard(){
    [card1, card2] = [null, null];
    lockBoard = false;
}

//Function for reseting game
function resetGame(){
  clearInterval(timer);
  timer = null;
  minutes = 3;
  seconds = 0;
  movesCounter = 0;

  displayTime();
  displayMoves();
  
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
  }else{
    minutes--;
    seconds = 59;
  }

  displayTime();

  if(minutes === 0 && seconds === 0) clearInterval(timer);
}

//Displaying time formated
function displayTime(){
  let displayMinutes = 
  (minutes > 0)? ((minutes < 10)? "0" + minutes + ":" : minutes + ":") : "";

  let displaySeconds = 
  (seconds < 10) ? "0" + seconds : seconds;

  time.textContent = displayMinutes + displaySeconds;
}

//Displaying number of moves
function displayMoves(){
  moves.textContent = movesCounter;
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
