# **Welcome To My JS BlackJack Project

**Creator: William Kostreski**

**LinkedIn: https://www.linkedin.com/in/william-kostreski/**

**Github: https://github.com/willikoski**

**In this project, I wanted to see if it was possible of completing the game using the Class method, of making a fully functional game.**

----------**Functionality of the game**------------

**Logic **- I wanted to create a blackjack game where users can try counting cards. Most casinos use more then 4 decks to avoid or minimize card counters so they maintain the house edge.     


**Functionality** - Users will be allowed to choose how many decks they'd like the game to have.                                                                                               

**Functionality 2.** - Cards left, and deadpile of cards will be tracked live time after every hand, so users may try tracking what the dealer has.                                            

**Cheat sheet** - The input for cheat sheet is something most casinos will allow at the table, It more of a recommendation of how to play the game, wether to hit or stand / Not actual cheats.

**If Music** gets in the way please use the mute all input bottom right of the users table side.                                                                                               

**Cheat codes** to keep your balance up, on keypress "v" the user will add 10,000 currency to his overall balance, and keypress "b" will give the user a blackjack "May break the card count"  

Force Reshuffle once the deck hits 0 cards left                                                                                                                                            
--------------------------------

-------------**All Methods used in the JS In Order** -----------------

##### **Constructor:**
- constructor
##### **Deck Management:**
- createDeck
- shuffleDeck
##### **Game Initialization:**
- startGame
- dealInitialHands
##### **Player Actions:**
- hit
- stand
- placeBet 
##### **Card Handling:**
- drawCard
- updateCardCounter
##### **Hand Calculation:**
- calculateHandValue
##### **Winning Logic:**
- determineWinner
##### **UI Display:**
- displayHands
- displayPlayerHand
- displayDealerHand
- displayDeadPileCount
##### **Game State Management:**
- restartGame
- resetHands
##### **Round Statistics:**
- updateRoundsWon
##### **UI Update:**
- updateUI
- updateCardUI
##### **Audio Handling:**
- playAudio
- playBackgroundMusic

-------------**All Methods used in the JS In Order** -----------------

Structure was created first, with a Main Class, and an array system where images and values are created with images pulled based off image name.

Future Updates: Better visuals / And a split function. 

Disclaimer, all images, sounds, music are royalty free.

I will not be re creating this proejct using a different system then Class.
