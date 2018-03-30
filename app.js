var game = new Chess();
var board = new ChessBoard('board', {
  onSquareClick: onSquareClick
});
var synth = new Tone.Synth({
  oscillator : {
    type : 'triangle8'
  },
  envelope : {
    attack : 2,
    decay : 1,
    sustain: 0.4,
    release: 4
  }
}).toMaster()

function onSquareClick(clickedSquare, selectedSquares) {
  if (selectedSquares.length === 0) {
    if (game.moves({ square: clickedSquare }).length > 0) {
      board.selectSquare(clickedSquare);
    }

    return;
  }

  var selectedSquare = selectedSquares[0];
   
  if (clickedSquare === selectedSquare) {
    board.unselectSquare(clickedSquare);
    return;
  }

  board.unselectSquare(selectedSquare);

  var clickedPieceObject = game.get(clickedSquare);
  var selectedPieceObject = game.get(selectedSquare);

  if (clickedPieceObject && (clickedPieceObject.color === selectedPieceObject.color)) {
    board.selectSquare(clickedSquare);
    return;
  }

  var legalMoves = game.moves({ square: selectedSquare, verbose: true });
  var isMoveLegal = legalMoves.filter(function(move) {
    return move.to === clickedSquare;
  }).length > 0;

  if (!isMoveLegal) {
    return;
  }

  if (selectedPieceObject.type === 'p' && (clickedSquare[1] === '1' || clickedSquare[1] === '8')) { // Promotion
    board.askPromotion(selectedPieceObject.color, function(shortPiece) {
      move(selectedSquare, clickedSquare, shortPiece);
    });
  } else {
    move(selectedSquare, clickedSquare);
  }
}

function move(from, to, promotionShortPiece) {
  game.move({
    from: from,
    to: to,
    promotion: promotionShortPiece
  });
  var time = Tone.context.currentTime
  console.log(from[0].toUpperCase()+(from[1]-1).toString(),to[0].toUpperCase()+(to[1]-1).toString())
  board.setPosition(game.fen());

  for(i=from[1]-1;i<to[1];++i){
    var move = from[0].toUpperCase()+i.toString()
    synth.triggerAttackRelease(move, 0.3, time++)
  }

  randomMove();
}

function randomMove() {
  var legalMoves = game.moves();

  var randomIndex = Math.floor(Math.random() * legalMoves.length);

  game.move(legalMoves[randomIndex]);
  board.setPosition(game.fen());

  if (game.game_over()) {
    if (game.in_checkmate()) {
      alert('You ' + (game.turn() === 'w' ? 'lost' : 'won'));
    } else {
      alert('It\'s a draw');
    }
  }
}

