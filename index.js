const gridContainer = document.querySelector(".grid-container");
let firstCard, secondCard;
let timeoutId = null;
let matches = 0;

let data1 = [
    {
        "name": "red",
        "color": "red",
        "snd": "cards/red.wav"
    },
    {
        "name": "orange",
        "color": "orange",
        "snd": "cards/orange.wav"
    },
    {
        "name": "yellow",
        "color": "yellow",
        "snd": "cards/yellow.wav"
    },
    {
        "name": "green",
        "color": "green",
        "snd": "cards/green.wav"
    },
    {
        "name": "blue",
        "color": "blue",
        "snd": "cards/blue.wav"
    },
    {
        "name": "purple",
        "color": "purple",
        "snd": "cards/purple.wav"
    },
    {
        "name": "black",
        "color": "black",
        "snd": "cards/black.wav"
    },
    {
        "name": "white",
        "color": "whtie",
        "snd": "cards/white.wav"
    }
] 

let cards = [...data1, ...data1];

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        let style = "";
        let image = "";
        if (card.color) {
            style = `style="background-color:${card.color};"`;
        }
        if (card.image) {
            image = `<img class="front-image" src=${card.image} />`
        }
        cardElement.innerHTML = `
            <div class="front" ${style}>
                ${image}
                <audio src=${card.snd}></audio>
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard() {
    if (this.classList.contains("flipped")) return;

    if (document.getElementById('gamelock').checked) {
        document.getElementById('gamelock').checked = false;
        updateLock();    
    }

    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
        unflipCards();
    }

    this.classList.add("flipped");
    this.getElementsByTagName("audio")[0].play();

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

function playAudio() {
    this.getElementsByTagName("audio")[0].play();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards()
        matches = matches + 1;
        checkWin();
        //console.log("match")
    } else {
        unflipCardsDelay();
    }
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
}

function unflipCardsDelay() {
    timeoutId = setTimeout(() => {
        timeoutId = null;
        unflipCards();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
}

function newgame() {
    resetBoard();
    matches = 0;
    shuffleCards();
    gridContainer.innerHTML = "";
    generateCards();
    document.getElementById('gamelock').checked = false;
    updateLock();
}

function updateLock() {
    document.getElementById('newgame').disabled = !document.getElementById('gamelock').checked;
}

function checkWin(m) {
    if (matches == 8) {
        document.getElementById('gamelock').checked = true;
        updateLock();
        enableAudio();
    }
}

function enableAudio() {
    const listCardElements = Array.from(gridContainer.children);
    listCardElements.forEach((cardElement) => {
        cardElement.addEventListener("click", playAudio);
    });
}

newgame();
