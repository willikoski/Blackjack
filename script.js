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

    createDeck(deckAmount) {   //deckAmount will be used later in order to create multiple decks based off this array
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

    startGame(deckAmount) { // Start game method will be used to determine how many dekcs were created.

    }

    drawCard() {

    }

    updateRoundsWon() {

    }

    dealInitialHands() {

    }

    calculateHandValue() {

    }

    displayHouseFirstCard() {

    }

    updateCardCounter() {

    }

    hit() {

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
