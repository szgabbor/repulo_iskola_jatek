'use strict';

var nim = function() {
    
    //The Game board
    var board = {
        pileOne: 7,
        pileTwo: 5,
    }
    
    var playerOne = true;
    var isBeginningOfGame = true;
    
    //Check the object if it's valid
    var parseObj = function(o) {
    	if (typeof o.pileOne === 'undefined') o.pileOne = board.pileOne;
    	if (typeof o.pileTwo === 'undefined') o.pileTwo = board.pileTwo;
        return ((typeof o.pileOne !== 'undefined' && o.pileOne >= 0) &&
            (typeof o.pileTwo !== 'undefined' && o.pileTwo >= 0));
    };

    //is the move legal
    var isMoveLegal = function(obj) {
        var changed = 0;
        if (obj.pileOne !== board.pileOne) {
            if (obj.pileOne > board.pileOne) {
                return false;
            }
            changed = changed + 1;
        }

        if (obj.pileTwo !== board.pileTwo) {
            var objPileTwo = Number(obj.pileTwo);
            var boardPileTwo = Number(board.pileTwo + 2);
			if (objPileTwo > boardPileTwo) {
                return false;
            }
            changed = changed + 1;
        }
        return changed === 1 || changed === 2;
    }



    var move = function(obj) {
		isBeginningOfGame = false;
        if (!parseObj(obj)) {
            console.log('one', (typeof obj.pileOne !== 'undefined' && obj.pileOne >= 0));
            console.log('two', (typeof obj.pileTwo !== 'undefined' && obj.pileTwo >= 0));

            throw new Error('object needs all the piles defined');
        }

        if (!isMoveLegal(obj)) {
            throw new Error('Nem megengedett lépés!!!');
        }

        board = obj;
        playerOne = !playerOne;
        return board;
    };

    var getBoard = function() {
        return JSON.parse(JSON.stringify(board));
    };

    var getPlayer = function() {
        return playerOne;
    };

    var isGameOver = function() {
        return (board.pileTwo === 0 && board.pileOne === 0);
    };

    var getStatus = function() {
        if (isGameOver()) {
            return {
                player: playerOne ?  "Sajnos, most nem nyertél, de ne add fel.": "Nyertél. Gratulálunk! :)",
                isGameOn: false
            };
        }

        return {
            player: playerOne ? "Te jössz." : "Mi jövünk.",
            isGameOn: true
        }

    }

    var resetGame = function() {
        board = {
            pileOne: 7,
            pileTwo: 5,
        }
		playerOne = true;
        isBeginningOfGame = true;
    }

    return {
        move: move,
        board: getBoard,
        play: getPlayer,
        status: getStatus,
        reset: resetGame
    };
}
