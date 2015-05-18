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
}

function setupGame() {
  removed_card = grabRandomCard();
  player1_cards.push(grabRandomCard());
  player2_cards.push(grabRandomCard());
  player1_cards.push(grabRandomCard());
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
  
  if( req.body.player === '1' ) {
    
  } else if( req.body.player === '2' ) {
    
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
