let computerMemory = [];
let memoryLimit = 4;
let computerThinkingTimeout = null;


function computerPlay(){
    const forgetChance = 0.08;
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
                if(turn){
                    const nextDelay = 600 + Math.random() * 900;
                    computerThinkingTimeout = setTimeout(computerPlay, nextDelay);
                }
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
                }, 1750);
            }, 750);
        }, 700);
    }
}

function findKnownPair(){
    purgeMatchedFromMemory();
    for(let i = 0; i< computerMemory.length; i++){
        for(let j = i+1; j < computerMemory.length; j++){
            if(computerMemory[i].img === computerMemory[j].img)
                return [computerMemory[i].card, computerMemory[j].card];
        }
    }
    return null;
}

function purgeMatchedFromMemory(){
    computerMemory = computerMemory.filter(e => !e.card.classList.contains("flipped"));
}

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

function rememberCard(card){
    const img = card.querySelector(".cardBack img").src;
    if(computerMemory.some(e => e.card === card)) return;
    computerMemory.push({card, img});
    if(computerMemory.length > memoryLimit) computerMemory.shift();
}

function getRandomUnflippedCard(excludeCard){
    const unflipped = 
    [...cards].filter(c => !c.classList.contains("flipped") && c !== excludeCard);
    
    if(unflipped.length === 0) return null;
    return unflipped[Math.floor(Math.random() * unflipped.length)];
}

function clearComputerMemory(){
    computerMemory = [];
    if(computerThinkingTimeout){
        clearTimeout(computerThinkingTimeout);
        computerThinkingTimeout = null;
    }
}

function startComputerTurn(){
    lockBoard = true;
    const thinkTime = 800 + Math.random() * 1200;
    computerThinkingTimeout = setTimeout(() => {
        computerThinkingTimeout = null;
        computerPlay();
    }, thinkTime);
}