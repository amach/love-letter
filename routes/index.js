var express = require('express');
var router = express.Router();

var fullCards = [1, 1, 1, 1, 1,
            2, 2,
            3, 3,
            4, 4,
            5, 5,
            6, 7, 8];

var cardCounts = {
    1: 5,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 1,
    7: 1,
    8: 1
};

var cardNames = {
    1: 'Guard',
    2: 'Priest',
    3: 'Baron',
    4: 'Handmaid',
    5: 'Prince',
    6: 'King',
    7: 'Countess',
    8: 'Princess'
};

var removedCard;
var playerCards = {};
var numPlayers = 2;
var currentPlayer = 1;
var moveHistory = [];

function grabRandomCard() {
    var randNum = Math.floor(Math.random() * fullCards.length);
    
    if( fullCards.length > 0 ) {
        cardCounts[fullCards[randNum]]--;
        return fullCards.splice(randNum, 1);
    } else {
        return -1;
    }
}

function resetGame() {
    fullCards = [1, 1, 1, 1, 1,
                2, 2,
                3, 3,
                4, 4,
                5, 5,
                6, 7, 8];
    cardCounts = {
        1: 5,
        2: 2,
        3: 2,
        4: 2,
        5: 2,
        6: 1,
        7: 1,
        8: 1
    };
    removedCard = 0;
    playerCards = {};
    currentPlayer = 1;
    moveHistory = [];
}

function setupGame() {
    currentPlayer = 1;
    removedCard = grabRandomCard();
    moveHistory.push('Removed ' + removedCard + ' (' + cardNames[removedCard] + ')');
    
    for( var i = 0; i < numPlayers; i++ ) {
        playerCards[i] = [];
        playerCards[i].push(grabRandomCard());
        moveHistory.push('Player ' + (i+1) + ' drew ' + playerCards[i][0] + ' (' + cardNames[playerCards[i][0]] + ')');
    }
    
    playerCards[0].push(grabRandomCard());
    moveHistory.push('Player 1 drew ' + playerCards[0][1] + ' (' + cardNames[playerCards[0][1]] + ')');
}

function updateCurrentPlayer() {
    currentPlayer++;
  
  if( currentPlayer > numPlayers ) {
      currentPlayer = 1;
  }
}

function playerTurn( playerId, cardIndex ) {
    if( playerId-1 in playerCards ) {
        var playerHand = playerCards[playerId-1];
        
        if( cardIndex in playerHand ) {
            moveHistory.push('Player ' + playerId + ' played ' + playerHand[cardIndex] + ' (' + cardNames[playerHand[cardIndex]] + ')');
            playerHand.splice(cardIndex, 1);
            updateCurrentPlayer();
        }
    }

    // Next player draws a card to start their turn
    var newCard = grabRandomCard();
    if( newCard !== -1 ) {
        playerCards[currentPlayer-1].push(newCard);
        moveHistory.push('Player ' + currentPlayer + ' drew ' + playerCards[currentPlayer-1][1] + ' (' + cardNames[playerCards[currentPlayer-1][1]] + ')');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('overview', { title: 'Love Letter', nav_link: '/game' } );
});

router.get('/game', function(req, res, next) {
    resetGame();
    setupGame();
    
    res.render('game', { 
        title: 'Love Letter', 
        fullCardList: cardCounts,
        startCard: removedCard,
        cards: cardNames,
        playerHands: playerCards,
        currentPlayer: currentPlayer,
        moveHistory: moveHistory
    });
});

router.post('/game', function(req, res, next) {
    console.log(req.body);

    if( parseInt(req.body.player, 10) === currentPlayer ) {
        playerTurn( currentPlayer, parseInt(req.body.card, 10) );
    }
    
    res.render('game', { 
        title: 'Love Letter', 
        fullCardList: cardCounts,
        startCard: removedCard,
        cards: cardNames,
        playerHands: playerCards,
        currentPlayer: currentPlayer,
        moveHistory: moveHistory
    });
});

module.exports = router;
