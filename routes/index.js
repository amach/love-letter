var express = require('express');
var router = express.Router();

var full_cards = [1, 1, 1, 1, 1,
            2, 2,
            3, 3,
            4, 4,
            5, 5,
            6, 7, 8];

var card_names = {
  1: 'Guard',
  2: 'Priest',
  3: 'Baron',
  4: 'Handmaid',
  5: 'Prince',
  6: 'King',
  7: 'Countess',
  8: 'Princess'
};

var removed_card;
var player1_cards = [];
var player2_cards = [];
var number_of_players = 2;
var current_player = 1;

function grabRandomCard() {
  var rand_num = Math.floor(Math.random() * full_cards.length);
  return full_cards.splice(rand_num, 1);
}

function resetGame() {
  full_cards = [1, 1, 1, 1, 1,
            2, 2,
            3, 3,
            4, 4,
            5, 5,
            6, 7, 8];
  removed_card = 0;
  player1_cards = [];
  player2_cards = [];
  current_player = 1;
}

function setupGame() {
  current_player = 1;
  removed_card = grabRandomCard();
  player1_cards.push(grabRandomCard());
  player2_cards.push(grabRandomCard());
  player1_cards.push(grabRandomCard());
}

function updateCurrentPlayer() {
  current_player++;
  
  if( current_player > number_of_players ) {
    current_player = 1;
  }
}

function playerTurn( playerId, card_index ) {
  if( playerId === 1 ) {
    if( card_index in player1_cards ) {
      player1_cards.splice(card_index, 1);
      updateCurrentPlayer();
    }
  } else if( playerId === 2 ) {
    if( card_index in player2_cards ) {
      player2_cards.splice(card_index, 1);
      updateCurrentPlayer();
    }
  }
  
  if( current_player === 1 ) {
    player1_cards.push(grabRandomCard());
  } else if( current_player === 2 ) {
    player2_cards.push(grabRandomCard());
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
    fullCardList: JSON.stringify(full_cards),
    startCard: card_names[removed_card],
    cards: card_names,
    player1_hand: player1_cards,
    player2_hand: player2_cards
  });
});

router.post('/game', function(req, res, next) {
  console.log(req.body);
  
  if( parseInt(req.body.player, 10) === current_player ) {
    playerTurn( current_player, parseInt(req.body.card, 10) );
  }
  
  res.render('game', { 
    title: 'Love Letter', 
    fullCardList: JSON.stringify(full_cards),
    startCard: card_names[removed_card],
    cards: card_names,
    player1_hand: player1_cards,
    player2_hand: player2_cards
  });
});

module.exports = router;
