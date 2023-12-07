class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.currentBet = 0;
        this.playerCurrency = 10000;
        this.roundsWon = 0;
        this.gameInProgress = false;
        this.gameOver = true;
        this.dealerHiddenCardVisible = false;
        this.totalDecks = 1;
        this.betAmountInput = document.getElementById('bet-amount');
        this.placeBetButton = document.getElementById('place-bet');
        this.roundsWonPlayer = 0;
        this.roundsWonHouse = 0;
    }

    createDeck(deckAmount) {   // deckAmount will be used later in order to create multiple decks based off this array
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (let i = 0; i < this.totalDecks * deckAmount; i++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    const card = { suit, rank, image: this.getCardImageFileName(rank, suit) };
                    deck.push(card);
                }
            }
        }

        return this.shuffleDeck([...deck]);
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    getCardImageFileName(rank, suit) {  //gonna pull the images based off its name in the images folder.
        const formattedRank = rank.toLowerCase();
        const formattedSuit = suit.toLowerCase();
        return `${formattedRank}_of_${formattedSuit}.png`;
    }

    calculateHandValue(hand) {
        let sum = 0;
        let hasAce = false;
        let aceCount = 0;
    
        for (const card of hand) {
            if (!card || !card.rank) {
                console.error("Invalid card object:", card);
                continue; // Skip caard incase error
            }
    
            if (card.rank === 'A') {
                hasAce = true;
                aceCount++;
            } else if (['K', 'Q', 'J'].includes(card.rank)) {
                sum += 10;
            } else {
                sum += parseInt(card.rank, 10);
        }
    }
    
        // Ace value 1 or 11
        for (let i = 0; i < aceCount; i++) {
            if (sum + 11 <= 21 - (aceCount - 1 - i)) {
                sum += 11; // Always count it as 11 unless user is gonna bust then use else below
            } else {
                sum += 1; // Make the value 1 incase user will bust.
            }
        }
    
        return sum;
    }

    startGame(deckAmount) { // Start game method will be used to determine how many dekcs were created.
            // Check if a game is already in progress
            if (this.gameInProgress) {
                console.error("A game is already in progress.");
                return;
            }
        
            game = this;
            // create a deck if it doesnt exist
            if (!this.deck || this.deck.length === 0) {
                this.deck = this.createDeck(deckAmount);  // Pass deckAmount here
                this.deck = this.shuffleDeck([...this.deck]); // this.deck might be more then one, and at startgame we are running shuffleDeck.
            }
        
            // this.deckAmount = deckAmount;
            this.playerHand = [];
            this.dealerHand = [];
            this.currentBet = 0;
            this.deadPile = [];
            this.roundsWon = 0;
            this.gameOver = false; // Reset gameOver to false
            this.dealerHiddenCardVisible = false; // Reset the flag
        
        
            // Update the card counter directly here
            // this.updateCardCounter(); // gonna call this later for our updateCardCounter method
            updateUI(); // gonna call this later once the method exists
    }

    drawCard() {
            if (this.deck.length === 0) { 
                this.deck = this.shuffleDeck([...this.deadPile]); // shuffleDeck  at 0 deck length.
            }
        
            const card = this.deck.pop(); // pop a card from the deck array
            // this.deadPile.push(card); // for the deadPile method we are gonna push a card for the counter then later call the updateCardCounter
            // this.updateCardCounter(); // Add this line
            console.log("Card drawn:", card); // Add this line
            return card;
    }

    formatHand(hand) {
        return hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
      }
    }

    hit() {
        if (this.calculateHandValue(this.playerHand) < 21) {
            this.playerHand.push(this.drawCard());
            // this.displayHands(); // gonna be called later
            // this.updateCardCounter();
            // this.displayHouseFirstCard(); 
            if (this.calculateHandValue(this.playerHand) > 21) {

                this.restartGame();
            }
        }
    }

    displayHouseFirstCard() {
        const houseFirstCard = document.querySelector('.card-house-start');
    
        if (this.dealerHand.length > 0) {
          const firstCard = this.dealerHand[0];
          const cardElement = document.createElement("div");
          cardElement.textContent = `${firstCard.rank} of ${firstCard.suit}`;
          houseFirstCard.innerHTML = "";
          houseFirstCard.appendChild(cardElement);
        }
    }

    dealInitialHands() {
        this.playerHand = [this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard()];
    }

    placeBet(betAmount) {
        if (this.gameInProgress) { // is game running?
            console.error("A game is already in progress. Restart the game to place a new bet.");
            return;
        }
    
        if (betAmount > 0 && betAmount <= this.playerCurrency) {
            this.startGame(); // run Start Game method because game is starting
    
            // reset state of the game
            this.currentBet = 0;
            this.deadPile = [];
            this.roundsWon = 0;
            this.gameOver = false;
            
            this.currentBet = betAmount; // place and draw card
            this.playerCurrency -= betAmount;
            this.playerHand = [this.drawCard(), this.drawCard()];
            this.dealerHand = [this.drawCard(), this.drawCard()]; //dealer and player draw

            this.displayHands();
            this.displayHouseFirstCard(); // visualise the hand method
            this.gameInProgress = true; // game is in progress once bet is placed
            this.betAmountInput.disabled = true;
            this.placeBetButton.disabled = true;

            this.updateCardCounter();
            console.log("Place Bet - Card Counter Updated");
        } else {
            console.error("Invalid bet amount or insufficient funds.");
        }
    }

    stand() {
        // Check if a game is in progress
        if (!this.gameInProgress) {
            console.error("No game in progress.");
            return;
        }
    
        // disable the placebet button and hit button
        this.placeBetButton.disabled = true;
        document.getElementById("hit").disabled = true;
    
        // dealer turn 
        while (this.calculateHandValue(this.dealerHand) < 17) {
            const drawnCard = this.drawCard();
            if (drawnCard && drawnCard.rank && drawnCard.suit) { // Ensure that the drawn card is valid
                this.dealerHand.push(drawnCard);
            } else {
                console.error("Invalid card object:", drawnCard);
                break;
            }
        }

        this.displayHands(); 
        this.determineWinner();
        this.gameInProgress = false; // Update the game state after the dealer's turn
        this.gameOver = true;
        this.dealerHiddenCardVisible = true;
        let countdown = 4; // enable buttons after 4 seconds
        const countdownInterval = setInterval(() => {
            this.placeBetButton.textContent = `Cooldown: (${countdown}s)`; // edit text based off seconds on countdown
            countdown--;
            if (countdown = 0) {
                // Enable the stand
                clearInterval(countdownInterval);
                this.placeBetButton.textContent = "Place Bet";
                this.betAmountInput.disabled = false; // Enable the input after the countdown
                this.placeBetButton.disabled = false;
                document.getElementById("hit").disabled = false; // enable the hit button
            }
        }, 1000);
    }

    displayHands() {
        this.displayPlayerHand();
        this.displayDealerHand();
    }

    displayPlayerHand() {
        updateCardUI(this.playerHand, "card-player-start");
    }

    displayDealerHand() {
      const container = document.querySelector(".card-house-start");
      container.innerHTML = "";
  
        for (let i = 0; i < this.dealerHand.length; i++) {
          const card = this.dealerHand[i];
          const cardContainer = document.createElement("div");
  
          const cardImage = document.createElement("img");
          cardImage.src = i === 0 && !this.dealerHiddenCardVisible ? 'images/back_card.png' : `images/${card.image}`;
  
          const cardText = document.createElement("div");
          cardText.textContent = i === 0 && !this.dealerHiddenCardVisible ? "Hidden" : `${card.rank} of ${card.suit}`;
          cardImage.style.width = "155px";
          cardImage.style.height = "auto"; 
          cardContainer.appendChild(cardImage);
          cardContainer.appendChild(cardText);
          container.appendChild(cardContainer);
        }
      // Display the total value for the visible cards
      const visibleCards = this.dealerHiddenCardVisible ? this.dealerHand : this.dealerHand.slice(1);
      const houseValue = this.calculateHandValue(visibleCards);
      document.getElementById("house-value").textContent = houseValue;
    }

    resetHands() {
        this.playerHand = [];
        this.dealerHand = [];
  
         // update UI for hands
        this.displayHands();
    }

    updateRoundsWon() {

    }

    updateCardCounter() {
        console.log("Updating card counter");
        const cardCounterElement = document.querySelector('.card-counter');
        if (cardCounterElement) {
            const remainingCards = this.deck.length;
            // console.log("Remaining cards in deck:", remainingCards);  
            // console.log("Deck Amount:", this.deckAmount);
            cardCounterElement.textContent = `${remainingCards}`;
        } else {
            console.error("Element with class 'card-counter' not found.");
        }
    }

    determineWinner() {

    }

    restartGame() {
        this.gameInProgress = false;
        this.betAmountInput.disabled = false;
        this.placeBetButton.disabled = false;
      }

    displayDeadPileCount() {

    }
// Global Functions

function updateCardUI(hand, containerId) {
    const container = document.querySelector(`.${containerId}`);
    container.innerHTML = "";

    if (Array.isArray(hand)) {
        for (const card of hand) {
            const cardContainer = document.createElement("div");
            cardContainer.classList.add("card-container"); 

            const cardImage = document.createElement("img");
            cardImage.src = card.image === "back_card.png" ? "images/back_card.png" : `images/${card.image}`;
            cardImage.style.width = "155px";
            cardImage.style.height = "auto"; 
            const cardText = document.createElement("div");
            cardText.textContent = `${card.rank} of ${card.suit}`;

            cardContainer.appendChild(cardImage);
            cardContainer.appendChild(cardText);
            container.appendChild(cardContainer);
        }
    }
}

function updateUI() {
    document.getElementById("house-value").textContent = game.calculateHandValue(game.dealerHand);
    document.getElementById("player-value").textContent = game.calculateHandValue(game.playerHand);
    document.getElementById("player-currency").textContent = `${game.playerCurrency.toFixed(2)}`;

    game.displayHands();
    game.updateRoundsWon("house-rounds-won", game.roundsWonHouse);
    game.updateRoundsWon("player-rounds-won", game.roundsWonPlayer);
}


document.addEventListener("DOMContentLoaded", function () {
    game = new BlackjackGame();

    document.getElementById("deck-amount").addEventListener("click", function () {
        const deckAmountInput = document.getElementById("deck-amount-input");
        const deckAmount = parseInt(deckAmountInput.value, 10) || 1;
        this.style.opacity = "0";
        this.disabled = true;
        this.style.cursor = "default";

        playAudio('audios/shuffle.mp3', 0.75);

        if (deckAmount > 0) {
            game.startGame(deckAmount);
            updateUI();
            document.getElementById("place-bet").style.display = "inline-block"; // make place button visible
        } else {
            alert("Invalid deck amount. Please enter a valid amount.");
        }
    });

    function playAudio(audioFile) {
        const audio = new Audio(audioFile);
        audio.play();
    }

    document.getElementById("place-bet").addEventListener("click", () => {
        const betAmountInput = document.getElementById("bet-amount");
        const betAmount = parseInt(betAmountInput.value, 10) || 0;
        game.doubledDown = false;
        if (betAmount > 0 && betAmount <= game.playerCurrency) {
            game.placeBet(betAmount);
            playAudio('audios/card.mp3', .75); // Adjust the volume as needed
            updateUI();
        } else {
            alert("Invalid bet amount. Please enter a valid amount within your available currency.");
        }
    });

    document.getElementById("hit").addEventListener("click", function () {
        if (game.playerHand.length === 0) {
            alert("Place a bet before hitting.");
            return;
        }

        game.hit();
        playAudio('audios/card.mp3', 0.75); // Adjust the volume as needed
        updateUI();
        document.getElementById("double-down").disabled = true; // disabled double down method
    });
    
    function playAudio(audioFile, volume) {
        const audio = new Audio(audioFile);
        audio.volume = volume;
        audio.play();
    }


    document.getElementById("double-down").addEventListener("click", function () {

        if (game.doubledDown) {
            alert("You can only double down once per round.");
            return;
        }

            if (game.playerHand.length === 0) {
                alert("Place a bet before doubling down.");
                return;
            }
            // Double Down math
            const originalBet = game.currentBet;
            const additionalBet = originalBet;
            const totalBet = originalBet + additionalBet;

            if (totalBet <= game.playerCurrency) { // cash has to be sufficient
                game.playerCurrency -= additionalBet;
                game.currentBet = totalBet;
                game.doubledDown = true;
                game.playerHand.push(game.drawCard());
                game.determineWinner();
                game.stand();
                updateUI();
            } else {
                alert("Insufficient funds to double down.");
            }
    });

    document.getElementById("stand").addEventListener("click", function () {
        if (game.playerHand.length === 0) {
            alert("Place a bet before standing.");
            return;
        }
        game.stand();
        updateUI();
    });

    document.addEventListener("keypress", function (event) {
        if (event.key === '') {
            game.playerCurrency += 10000;
            updateUI();
        } else if (event.key === 'b') {
            // Simulate player getting a blackjack
            game.playerHand = [
                { suit: 'Hearts', rank: 'A', image: 'a_of_hearts.png' },
                { suit: 'Hearts', rank: 'K', image: 'k_of_hearts.png' },
            ];
            // game.dealerHand = [
            //     { suit: 'Clubs', rank: '10', image: '10_of_clubs.png' },
            //     { suit: 'Diamonds', rank: 'Q', image: 'q_of_diamonds.png' }
            // ];
    
            // Update the UI after giving the player a blackjack
            updateUI();
        }
    });
});

// Bg Music
function playBackgroundMusic() {
    let audio = document.querySelector('.Music audio');
    let checkbox = document.getElementById('music-all');
    audio.volume = checkbox.checked ? 0 : 0.1; //.1 is 10% audio
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// event listener for music-all
document.getElementById('music-all').addEventListener('change', playBackgroundMusic);

document.getElementById("deck-amount").addEventListener("click", function() {
    playBackgroundMusic();
});