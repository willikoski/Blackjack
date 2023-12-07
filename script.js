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

    updateRoundsWon() {

    }

    updateCardCounter() {

    }

    placeBet(betAmount) {  // gonna call the betAmount so we can place a bet

    }

    determineWinner() {

    }

    restartGame() {

    }

    stand() {

    }

    resetHands() {

    }

    displayHands() {

    }

    displayPlayerHand() {

    }

    displayDealerHand() {

    }

    displayDeadPileCount() {

    }

    formatHand(hand) {

    }
}
