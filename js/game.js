const cards = document.querySelectorAll(".card");
const time = document.getElementById("time");
const moves = document.getElementById("moves");

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

const pairedImages = [...cardBackImages, ...cardBackImages];

const shuffledImages = shuffle(pairedImages);

let card1 = null, card2 = null;
let lockBoard = false;
let movesCounter = 0, minutes = 3, seconds = 0, timer = null;


window.addEventListener('DOMContentLoaded', () => {
    cards.forEach((card, index) => {
        const img = card.querySelector(".cardBack img");
        img.src = shuffledImages[index];
    })
})

cards.forEach(card => {
    card.addEventListener('click', () => {
       if(lockBoard) return;
       if(card === card1 || card.classList.contains("flipped")) return;

       if(!timer) timer = setInterval(updateTime, 1000);
       card.classList.add("flipped");
       movesCounter++;
       moves.textContent = movesCounter;

       if(!card1) {
        card1 = card;
       }
       else{
        card2 = card;
        checkMatch();
       }
    });
});

function checkMatch(){
    const img1 = card1.querySelector(".cardBack img").src;
    const img2 = card2.querySelector(".cardBack img").src;

    if(img1 === img2){
      resetBoard();
    }
    else{
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        resetBoard();
      }, 1500);
    }
}

function resetBoard(){
    [card1, card2] = [null, null];
    lockBoard = false;
}

function updateTime(){
    if(seconds > 0){
        seconds--;
    }else{
        minutes--;
        seconds = 59;
    }

    let displayMinutes = 
    (minutes > 0)? ((minutes < 10)? "0" + minutes + ":" : minutes + ":") : "";

    let displaySeconds = 
    (seconds < 10) ? "0" + seconds : seconds;

    time.textContent = displayMinutes + displaySeconds;

    if(minutes === 0 && seconds === 0) clearInterval(timer);
}


function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
