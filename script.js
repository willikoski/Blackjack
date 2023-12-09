class BlackjackGame {
    constructor() {
      this.deck = this.createDeck();
      this.playerHand = [];
      this.dealerHand = [];
      this.currentBet = 0;
      this.playerCurrency = 10000;
      this.roundsWon = 0;
      this.gameInProgress = false;
      this.gameOver = true;
      this.dealerHiddenCardVisible = false;
      this.totalDecks = 1; // Set a default value for the total number of decks
  
      // UI elements
      this.betAmountInput = document.getElementById('bet-amount');
      this.placeBetButton = document.getElementById('place-bet');
      this.roundsWonPlayer = 0;
      this.roundsWonHouse = 0;
    }

    // Deck Creation And shuffle//
    createDeck(deckAmount) {  
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

    getCardImageFileName(rank, suit) {
        const formattedRank = rank.toLowerCase();
        const formattedSuit = suit.toLowerCase();
    return `${formattedRank}_of_${formattedSuit}.png`;
    }
    // Deck Creation And shuffle//

    //Hand Calculation//
    calculateHandValue(hand) {
        let sum = 0;
        let hasAce = false;
        let aceCount = 0;
        
        for (const card of hand) {
            if (!card || !card.rank) {
                console.error("Invalid card object:", card);
                continue; // Skip this card and move to the next one
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
        
        // Add the value of Aces (11 or 1) to the sum
        for (let i = 0; i < aceCount; i++) {
            if (sum + 11 <= 21 - (aceCount - 1 - i)) {
                sum += 11; // Count Ace as 11
            } else {
                sum += 1; // Count Ace as 1 to prevent bust
            }
        }
        
        return sum;
    }
    //Hand Calculation//

    //Game Start and Car deal//
    startGame(deckAmount) {
        // Check if a game is already in progress
        if (this.gameInProgress) {
            console.error("A game is already in progress.");
            return;
        }
    
        game = this;
    
        // Only create a new deck if it never exists //
        if (!this.deck || this.deck.length === 0) {
            this.deck = this.createDeck(deckAmount);  // Pass deckAmount here
            this.deck = this.shuffleDeck([...this.deck]);
        }
    
        this.deckAmount = deckAmount;
        this.playerHand = [];
        this.dealerHand = [];
        this.currentBet = 0;
        this.deadPile = [];
        this.roundsWon = 0;
        this.gameOver = false; 
        this.dealerHiddenCardVisible = false; 

        this.updateCardCounter();
        updateUI();
    }

    dealInitialHands() {
        this.playerHand = [this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard()];
    }
    //Game Start and Car deal//

    //Player Actions//
    hit() {
        const playerHandValue = this.calculateHandValue(this.playerHand);
        console.log("Player hand value before hit:", playerHandValue);
    
        if (playerHandValue < 21) {
            this.playerHand.push(this.drawCard());
            this.displayHands();
            this.updateCardCounter();
            this.displayHouseFirstCard();
    
            const updatedHandValue = this.calculateHandValue(this.playerHand);
            console.log("Player hand value after hit:", updatedHandValue);
    
            if (updatedHandValue > 21) {
                console.log("Player busts. Restarting the game.");
                this.updateRoundsWon("house-rounds-won", this.roundsWonHouse); // Update rounds won for the house
                this.displayDeadPileCount();
                this.restartGame();
                this.gameOver = true;
            }
        }
    }

    stand() {
        // Check if a game is in progress
        if (!this.gameInProgress) {
            console.error("No game in progress.");
            return;
        }
    
        // Disable the stand and hit
        this.placeBetButton.disabled = true;
        document.getElementById("hit").disabled = true;

        while (this.calculateHandValue(this.dealerHand) < 17) {
            const drawnCard = this.drawCard();
            if (drawnCard && drawnCard.rank && drawnCard.suit) {
                this.dealerHand.push(drawnCard);
            } else {
                console.error("Invalid card object:", drawnCard);
                break;
            }
        }
    
        // Display both the player's and dealer's hands
        this.displayHands();
        this.determineWinner();
    
        // Update the game state after the dealer's turn
        this.gameInProgress = false;
        this.gameOver = true;
        this.dealerHiddenCardVisible = true;
    
        // Enable the "Stand" button and "Hit" button after the next bet
        let countdown = 2;
        const countdownInterval = setInterval(() => {
            // Update the button text with the countdown
            this.placeBetButton.textContent = `Cooldown: (${countdown}s)`;
    
            // Decrease the countdown
            countdown--;
    
            if (countdown < 0) {
                // Enable the "Stand" button after the countdown
                clearInterval(countdownInterval);
                this.placeBetButton.textContent = "Place Bet";
                this.betAmountInput.disabled = false; // Enable the input after the countdown
                this.placeBetButton.disabled = false;
                // Enable the "Hit" button
                document.getElementById("hit").disabled = false;
            }
        }, 1000);
    }

    placeBet(betAmount) {
        // Check if a game is already in progress
        if (this.gameInProgress) {
            console.error("A game is already in progress. Restart the game to place a new bet.");
            return;
        }
    
        if (betAmount > 0 && betAmount <= this.playerCurrency) {
            this.startGame();
            // Reset game state before placing a new bet
            this.currentBet = 0;
            this.deadPile = [];
            this.roundsWon = 0;
            this.gameOver = false;
            this.currentBet = betAmount;
            this.playerCurrency -= betAmount;

            this.playerHand = [this.drawCard(), this.drawCard()];
            this.dealerHand = [this.drawCard(), this.drawCard()]; // Two cards drawn 
    
            // Display the hands
            this.displayHands();
            this.displayHouseFirstCard();
    
            // Update the game state to indicate that a game is in progress
            this.gameInProgress = true;
            this.betAmountInput.disabled = true;
            this.placeBetButton.disabled = true;
    
            // Update the card counter
            this.updateCardCounter();
            console.log("Place Bet - Card Counter Updated"); // Add this line
        } else {
            console.error("Invalid bet amount or insufficient funds.");
        }
    }
    //Player Actions//

    
    drawCard() {
        if (this.deck.length === 0) {
            this.deck = this.shuffleDeck([...this.deadPile]);
            // Do not clear the dead pile here
        }
        const card = this.deck.pop();
        this.deadPile.push(card);
        this.updateCardCounter(); // Add this line
        console.log("Card drawn:", card); // Add this line
        return card;
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
    // Card Handling //

    //Game Rule Logic//

    determineWinner() {
        // Check if the game is already over
        if (this.gameOver) {
            console.error("The game is already over.");
            return;
        }
    
        // Declare dealerValue at the beginning / But playerValue will always show
        let dealerValue = this.calculateHandValue(this.dealerHand);
        const playerValue = this.calculateHandValue(this.playerHand);
    
        // Check for dealer blackjack
        if (this.dealerHand.length === 2 && dealerValue === 21) {
            this.displayDealerHand();
            console.log("House blackjack! Player loses.");
            this.roundsWonHouse++;
            this.updateRoundsWon("house-rounds-won", this.roundsWonHouse);
            this.displayDeadPileCount();
            this.gameOver = true;
            return; // Exit the function early
        }
    
        // Check if the dealer busts
        if (dealerValue > 21) {
            // Dealer busts we will show the cards //
            const winnings = this.currentBet * 2;
            this.displayDealerHand();
            console.log(`Dealer busts! You win ${winnings}!`);
            this.roundsWonPlayer++;
            this.playerCurrency += winnings;
            this.updateRoundsWon("player-rounds-won", this.roundsWonPlayer);
            this.displayDeadPileCount();
            this.gameOver = true;
            return; // Exit the function early
        }
    
        // Check for a push condition
        if (playerValue === dealerValue) {
            this.displayDealerHand(); // we will show the dealers hand because it's a push
            console.log("Push. Bet returned.");
            this.playerCurrency += this.currentBet; // push counts as a returned bet
            this.displayDeadPileCount();
            this.gameOver = true;
            return; // Exit the function early
        }
    
        // Logic for wins and losses //
        if (playerValue > 21 || (dealerValue <= 21 && dealerValue >= playerValue)) {
            // Player loses
            console.log("You lose.");
            this.roundsWonHouse++; // Increment rounds won for the house
            this.updateRoundsWon("house-rounds-won", this.roundsWonHouse); // Update rounds won for the house
            this.displayDeadPileCount();
            this.gameOver = true;
        } else if (playerValue === 21 && this.playerHand.length === 2 && !(dealerValue === 21 && this.dealerHand.length === 2)) {
            const winnings = this.currentBet * 2.5; // blackjack pays out 2.5 of the initial bet
            this.roundsWonPlayer++;
            this.playerCurrency += winnings;
            this.updateRoundsWon("player-rounds-won", this.roundsWonPlayer);
            this.displayDeadPileCount();
            console.log(`Blackjack! You win ${winnings}!`);
        } else {
            // Player wins
            const winnings = this.currentBet * 2;
            this.roundsWonPlayer++;
            this.playerCurrency += winnings;
            this.updateRoundsWon("player-rounds-won", this.roundsWonPlayer);
            this.displayDeadPileCount();
            console.log(`You win ${winnings}!`);
        }
    
        // The following line was removed to prevent double-setting gameOver
        // this.gameOver = true;
    
        // this.roundsWonHouse--; // dealer wins we had a round to its HTML element
        this.displayDealerHand(); // Makes all cards and value visible
    }
    //Game Rule Logic//

    //All User Interface stuff UI//
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

    displayDeadPileCount() {
        const deadPileCount = document.getElementById('dead-pile-cards');
    
        if (deadPileCount) {
            const uniqueCards = [...new Set(this.deadPile.map(card => card.rank + card.suit))];
            const currentCount = parseInt(deadPileCount.textContent, 10) || 0;
            const newCount = currentCount + uniqueCards.length;
    
            deadPileCount.textContent = newCount; // adding to the value for the counter
            console.log("Updated dead pile count:", newCount);
            this.updateCardCounter(); 
        } else {
            console.error("Element with ID 'dead-pile-cards' not found.");
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
    //All User Interface stuff UI//

    //Game Restart Logic//

    restartGame() {
        this.gameInProgress = false;
        this.betAmountInput.disabled = false;
        this.placeBetButton.disabled = false;
    }

    resetHands() {
        // Reset player and dealer hands
        this.playerHand = [];
        this.dealerHand = [];
      
        // Update UI without resetting the game state
        this.displayHands();
      }

    //Game Restart Logic//

    //Round Updater//

    updateRoundsWon(elementId, roundsWon) {
        const roundsWonElement = document.getElementById(elementId);
        if (roundsWonElement) {
            roundsWonElement.textContent = roundsWon;
        } else {
            console.error(`Element with ID ${elementId} not found.`);
        }
    }

    //Round Updater//

    // Formatting //
    formatHand(hand) {
        return hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
      }
    }
    // Formatting //


    // UI Functions //
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

// UI Functions //

// All DOM //

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
            document.getElementById("place-bet").style.display = "inline-block"; // inline wont break the style
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
            playAudio('audios/card.mp3', .75); 
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
        playAudio('audios/card.mp3', 0.75); 
        updateUI();
    
        // Disable the Double after Hit button
        document.getElementById("double-down").disabled = true;
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
    
        // Double down logic
        const originalBet = game.currentBet;
        const additionalBet = originalBet;
        const totalBet = originalBet + additionalBet;
    
        if (totalBet <= game.playerCurrency) {
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

// All DOM //