'use strict';
var nimAi = function() {
	
	var getXOR = function (board) {
		return board.pileOne ^ board.pileTwo;
	}

	var getRemainder = function (board) {
		return board.pileTwo % 3;
	}

	var isOptimalMovePossible = function(board) {
		return getRemainder(board) !== 0;
	};

	var makeOptimalMove = function(board) {
		
		var rem = getRemainder(board);
         
		var random_boolean = Math.random() >= 0.5;
		
		if (random_boolean && board.pileOne > 1) {
  		   var remTimesTwo = (2 * rem) % 3;
			board.pileOne = board.pileOne - remTimesTwo;
			board.pileTwo = board.pileTwo + remTimesTwo;
			return board;
		} else {
			board.pileTwo = board.pileTwo - rem;
			return board;			
		}
	}

	var removeOneFromLargestPile = function(board) {
		var random_boolean = Math.random() >= 0.5;
		if (board.pileOne > 0 && board.pileTwo > 0) {
		  if (random_boolean) {
			board.pileOne = board.pileOne - 1;
			board.pileTwo = board.pileTwo + 1;
			return board;		  	
		  } else {
			board.pileTwo = board.pileTwo - 1;
			return board;					  	
		  }
		}	else	if (board.pileOne > 0) {
			board.pileOne = board.pileOne - 1;
			board.pileTwo = board.pileTwo + 1;
			return board;
		} else if (board.pileTwo > 0) {
			board.pileTwo = board.pileTwo - 1;
			return board;			
		} else {
			return board;
		}
	}

	var makeMove = function(board, isBeginningOfGame) {
		if (isBeginningOfGame) return board;
		if (isOptimalMovePossible(board)) {
			board = makeOptimalMove(board);
		} else {
			board = removeOneFromLargestPile(board);
		}

		return board;
	};

	return {
		makeMove : makeMove
	}
}