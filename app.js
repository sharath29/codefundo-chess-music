var firebaseRef = firebase.database().ref()
var game = new Chess();
var NoteArray = [] 
var oppo = 0
var board = new ChessBoard('board', {
  onSquareClick: onSquareClick
});
// var synth = new Tone.Synth({
//   oscillator : {
//     type : 'triangle8'
//   },
//   envelope : {
//     attack : 2,
//     decay : 1,
//     sustain: 0.4,
//     release: 4
//   }
// }).toMaster()
var interval = 0.2
var synth = new Tone.Sampler({
      'A0' : 'A0.[mp3|ogg]',
      'C1' : 'C1.[mp3|ogg]',
      'D#1' : 'Ds1.[mp3|ogg]',
      'F#1' : 'Fs1.[mp3|ogg]',
      'A1' : 'A1.[mp3|ogg]',
      'C2' : 'C2.[mp3|ogg]',
      'D#2' : 'Ds2.[mp3|ogg]',
      'F#2' : 'Fs2.[mp3|ogg]',
      'A2' : 'A2.[mp3|ogg]',
      'C3' : 'C3.[mp3|ogg]',
      'D#3' : 'Ds3.[mp3|ogg]',
      'F#3' : 'Fs3.[mp3|ogg]',
      'A3' : 'A3.[mp3|ogg]',
      'C4' : 'C4.[mp3|ogg]',
      'D#4' : 'Ds4.[mp3|ogg]',
      'F#4' : 'Fs4.[mp3|ogg]',
      'A4' : 'A4.[mp3|ogg]',
      'C5' : 'C5.[mp3|ogg]',
      'D#5' : 'Ds5.[mp3|ogg]',
      'F#5' : 'Fs5.[mp3|ogg]',
      'A5' : 'A5.[mp3|ogg]',
      'C6' : 'C6.[mp3|ogg]',
      'D#6' : 'Ds6.[mp3|ogg]',
      'F#6' : 'Fs6.[mp3|ogg]',
      'A6' : 'A6.[mp3|ogg]',
      'C7' : 'C7.[mp3|ogg]',
      'D#7' : 'Ds7.[mp3|ogg]',
      'F#7' : 'Fs7.[mp3|ogg]',
      'A7' : 'A7.[mp3|ogg]',
      'C8' : 'C8.[mp3|ogg]'
    }, {
      'release' : 1,
      'baseUrl' : './audio/salamander/'
    }).toMaster();


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

function generateSound(from,to){
  var time = Tone.context.currentTime
  temp = from[0]
  //count ver used to increase or decrease to pitch ie sa re ga - ga re sa when pieces move horizontally
  var count = -1
  //horizontal direction octave sa0 re ga ma pa dha ni sa1, here sa1 has the same pitch when the s0 is scaled once to next higher octave scale 
  //vertical move does the scaling
  //forward move
  if(from[1]<to[1]){
    console.log("forward")
    for(i=from[1]-1;i<to[1];++i){
      count = count + 1
      if(from[0] < to[0]){
        if(temp < to[0])
          temp = (String.fromCharCode(from[0].charCodeAt()+count))
      }
      else if(from[0] > to[0]){
        if(temp > to[0])
          temp = (String.fromCharCode(from[0].charCodeAt()-count))
      }
      //temp has the required notes to play but without the octave scaling ie (E1 or E2) temp has E, i contains the vertical value for scaling
      var move = temp.toUpperCase()+i.toString()
      //there is no H in musical octave notation so the H file in chess board is assigned the next octave's first note ie sa1.
      if(move[0] == "H") move = "A" + (i+1)
      //(note tune to play, time duration, when to play)
      // duration for high pitched sounds reduced to make it more soothing
      if(i<3)
        synth.triggerAttackRelease(move, 0.3, time+=interval)
      else if(i<6)
        synth.triggerAttackRelease(move, 0.2, time+=interval)
      else
        synth.triggerAttackRelease(move, 0.1, time+=interval)
      console.log(move)
    }
  }
  //backward move
  else if(from[1]>to[1]){
    console.log("backward")
    for(i=from[1]-1;i>=to[1]-1;--i){
      count = count + 1
      if(from[0] < to[0]){
        if(temp < to[0])
          temp = (String.fromCharCode(from[0].charCodeAt(0)+count))
      }
      else if(from[0] > to[0]){
        if(temp > to[0])
          temp = (String.fromCharCode(from[0].charCodeAt(0)-count))
      }
      var move = temp.toUpperCase()+i.toString()
      if(move[0] == "H") move = "A" + (i+1)
      if(i>=0 && i<3)
        synth.triggerAttackRelease(move, 0.3, time+=interval)
      else if(i>=3 && i<6)
        synth.triggerAttackRelease(move, 0.2, time+=interval)
      else
        synth.triggerAttackRelease(move, 0.1, time+=interval)
      console.log(move)
    }
  }
  else{
    tempNum = Number(from[1])
    console.log("horizontal")
    if(from[0] < to[0]){
      for(i=from[0].charCodeAt();i<=to[0].charCodeAt();++i){
        count = count + 1
        temp = (String.fromCharCode(from[0].charCodeAt(0)+count))
        var move = temp.toUpperCase()+String.fromCharCode(from[1].charCodeAt(0)-1)
        if(move[0] == "H") move = "A" + String.fromCharCode(from[1].charCodeAt(0))
        console.log(move)
        if(tempNum>=0 && tempNum<3)
          synth.triggerAttackRelease(move, 0.3, time+=interval)
        else if(tempNum>=3 && tempNum<6)
          synth.triggerAttackRelease(move, 0.2, time+=interval)
        else
          synth.triggerAttackRelease(move, 0.1, time+=interval)
      }
    }
    else{
      for(i=from[0].charCodeAt();i>=to[0].charCodeAt();--i){
        count = count + 1
        temp = (String.fromCharCode(from[0].charCodeAt(0)-count))
        var move = temp.toUpperCase()+String.fromCharCode(from[1].charCodeAt(0)-1)
        if(move[0] == "H") move = "A" + String.fromCharCode(from[1].charCodeAt(0))
        console.log(move)
        if(tempNum>=0 && tempNum<3)
          synth.triggerAttackRelease(move, 0.3, time+=interval)
        else if(tempNum>=3 && tempNum<6)
          synth.triggerAttackRelease(move, 0.2, time+=interval)
        else
          synth.triggerAttackRelease(move, 0.1, time+=interval)  

      }
    }
  }
}
function storeNote(from,to){
	NoteArray.push(from + "," + to);
}

function move(from, to, promotionShortPiece) {
  game.move({
    from: from,
    to: to,
    promotion: promotionShortPiece
  });

  // stockfish analysis
  	var cur_fen=game.fen();
  	console.log(cur_fen);

  board.setPosition(game.fen());
  generateSound(from,to)
  storeNote(from,to);
  randomMove();
}



function playNotes(){
	for(let i=0;i<=NoteArray.length;++i){
		// var from = NoteArray[i].split(",")[0]
		// var to = NoteArray[i].split(",")[1]
		console.log(i)
		if(i == 0)
			firebaseRef.child("length").set(NoteArray.length)
		else
			firebaseRef.child(i.toString()).set(NoteArray[i])
	} 
}


function randomMove() {
  var legalMoves = game.moves();
  // console.log(legalMoves)
  // var randomIndex = Math.floor(Math.random() * legalMoves.length);

  //game.move(legalMoves[randomIndex]);
  // console.log("thismove"+legalMoves[randomIndex]);
  	var cur_fen=game.fen();
  	console.log(cur_fen);
		stockfish.postMessage('position fen '+cur_fen);
		stockfish.postMessage('go depth 15');
		stockfish.onmessage = function(event) {
      	if(event.data.split(" ")[0] == "bestmove")
			{
          fromMove = event.data.split(" ")[1].slice(0,2)
    			toMove = event.data.split(" ")[1].slice(2,4)
          game.move({ from : fromMove , to :toMove , promotion :'q'});
    			generateSound(fromMove,toMove)
  				storeNote(fromMove,toMove);

          // console.log(event.data.split(" ")[1].slice(0,2));
  				board.setPosition(game.fen());
			}
	board.setPosition(game.fen());

	 if (game.game_over()) {
    	if (game.in_checkmate()) {
      		alert('You ' + (game.turn() === 'w' ? 'lost' : 'won'));
    	} else {
      		alert('It\'s a draw');
    	}
    	playNotes()  
  	}
      // if(Number(event.data.split(" ")[2]) < 16)
    		// console.log("evaluation ",event.data.split(" ")[7]);
      // else
      //   console.log(event.data)
		};
  board.setPosition(game.fen());

  if (game.game_over()) {
    if (game.in_checkmate()) {
      alert('You ' + (game.turn() === 'w' ? 'lost' : 'won'));
    } else {
      alert('It\'s a draw');
    }
  }
}

