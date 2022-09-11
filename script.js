const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");

const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items Array
const items = [
  { name: "bee", image: "bee.png" },
  { name: "macaw", image: "macaw.png" },
  { name: "gorilla", image: "gorilla.png" },
  { name: "tiger", image: "tiger.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "chameleon", image: "chameleon.png" },
  { name: "piranha", image: "piranha.png" },
  { name: "anaconda", image: "anaconda.png" },
  { name: "sloth", image: "sloth.png" },
  { name: "cockatoo", image: "cockatoo.png" },
  { name: "toucan", image: "toucan.png" },
];

//Initial Time
let seconds=0, minutes=0;

//Initila moves and win count
let movesCount=0,  winCount=0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes++;
    seconds = 0;
  }
  //format time before display
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;

  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
    movesCount++;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`; 
};

//Pick random objects from the items array
const generateRandom = (size=4) => {
    //temporary array
    let tempArray = [...items];
    //initialize cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of object would exist
    size = (size*size) / 2;
    //Random object selection
    for(let i=0; i<size;i++){
        const randomIndex = Math.floor(Math.random()*tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex,1)
    }
    return cardValues;
};


const matrixGenerator = (cardValues , size = 4) =>{
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for(let i=0; i<size*size; i++){
        /*
            Create Cards
            before => front side (contains question mark)
            after => back side (contains actual image)
            data-card-valuyes is a custom attribute which stores the names of the cards to match later
        */
       gameContainer.innerHTML += `<div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after"><img src="./img/${cardValues[i].image}" class="image" width="93px" height="93px"></div>            
       </div>`;
    }

    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
    
    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //If selected card is not matched yet then only run (i.e already matched card when clicked wolud be ignored)
            if(!card.classList.contains("matched")){
                //flip the clicked card
                card.classList.add("flipped");
                //if it is the firstcard (!firstCard since firstCard is initially false)
                if (!firstCard) {
                  //so current card will become firstcard
                  firstCard = card;
                  //current cars value becomes firstCardValue
                  firstCardValue = card.getAttribute("data-card-value");
                } else {
                  //increment moves since user selected second card
                  movesCounter();
                  //secondCard and Value
                  secondCard = card;
                  let secondCardValue = card.getAttribute("data-card-value");
                  if (firstCardValue == secondCardValue) {
                    //if both cards match add matched class so these cards would be ignored next time
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    //set firstCard to false since next card would be first now
                    firstCard = false;
                    //winCount increment as user found a correct match
                    winCount++;
                    //check if winCount == half of cardValues
                    if (winCount == Math.floor(cardValues.length / 2)) {
                      result.innerHTML = `<h2>You Won</h2>
                        <h4>Moves: ${movesCount}</h4>`;
                      stopGame();
                    }
                  } else {
                    //if the cards dont match
                    //flip the cards back to normal
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    let delay = setTimeout(() => {
                      tempFirst.classList.remove("flipped");
                      tempSecond.classList.remove("flipped");
                    }, 900);
                  }
                }
            }
        });
    });
};


//Start game
startButton.addEventListener("click", ()=>{
    movesCount = 0;
    time = 0;
    //controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator,1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
} );

//Stop Game
stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
}))


//Initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues)
    matrixGenerator(cardValues);
};
