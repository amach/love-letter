var express = require('express');
var router = express.Router();

var fullCards = [1, 1, 1, 1, 1,
            2, 2,
            3, 3,
            4, 4,
            5, 5,
            6, 7, 8];

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
var player1Cards = [];
var player2Cards = [];
var numPlayers = 2;
var currentPlayer = 1;

function grabRandomCard() {
    var randNum = Math.floor(Math.random() * fullCards.length);
    return fullCards.splice(randNum, 1);
}

function resetGame() {
    fullCards = [1, 1, 1, 1, 1,
                2, 2,
                3, 3,
                4, 4,
                5, 5,
                6, 7, 8];
    removedCard = 0;
    player1Cards = [];
    player2Cards = [];
    currentPlayer = 1;
}

function setupGame() {
    currentPlayer = 1;
    removedCard = grabRandomCard();
    player1Cards.push(grabRandomCard());
    player2Cards.push(grabRandomCard());
    player1Cards.push(grabRandomCard());
}

function updateCurrentPlayer() {
    currentPlayer++;
  
  if( currentPlayer > numPlayers ) {
      currentPlayer = 1;
  }
}

function playerTurn( playerId, cardIndex ) {
    if( playerId === 1 ) {
        if( cardIndex in player1Cards ) {
            player1Cards.splice(cardIndex, 1);
            updateCurrentPlayer();
        }
    } else if( playerId === 2 ) {
        if( cardIndex in player2Cards ) {
            player2Cards.splice(cardIndex, 1);
            updateCurrentPlayer();
        }
    }

    if( currentPlayer === 1 ) {
        player1Cards.push(grabRandomCard());
    } else if( currentPlayer === 2 ) {
        player2Cards.push(grabRandomCard());
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
        fullCardList: JSON.stringify(fullCards),
        startCard: cardNames[removedCard],
        cards: cardNames,
        player1Hand: player1Cards,
        player2Hand: player2Cards
    });
});

router.post('/game', function(req, res, next) {
    console.log(req.body);

    if( parseInt(req.body.player, 10) === currentPlayer ) {
        playerTurn( currentPlayer, parseInt(req.body.card, 10) );
    }

    res.render('game', { 
        title: 'Love Letter', 
        fullCardList: JSON.stringify(fullCards),
        startCard: cardNames[removedCard],
        cards: cardNames,
        player1Hand: player1Cards,
        player2Hand: player2Cards
    });
});

module.exports = router;
