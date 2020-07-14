//The game board handles all the dom interaction
//Drawing the board and listening for click events
var gameBoard = function() {

    //store a reference to the container
    var container = document.querySelector('.game').querySelector('.board');

    var info = document.querySelector('.move');

    //create an image node
    var returnImg = function(num, source, lastTwo) {
        //create a new image
        var img = new Image();
        //set the image source
        img.src = source;
        //add the class so we know wich one the user is hovering over
        img.classList.add(num);
        //get a reference to the style object
        var s = img.style
        s.width = '10%';
        s.padding = '5px';
        if (lastTwo) s.opacity = '0.5';
        return img;
    }


    var drawPile = function(num, source) {
        //create a document fragment once
        var frag = document.createDocumentFragment();
        //create all num images
        for (var i = 0; i < num; i = i + 1) {
			var lastTwo = false; 
			if (i + 2 < num) lastTwo = true;
            var img = returnImg(i + 1, source, lastTwo);
            frag.appendChild(img);
        }
        //return the fragment
        return frag;
    }
    var hoverEvent = function() {
        var parent = this.parentElement;
        parent.classList[1];
        var num = parseInt(this.parentElement.querySelectorAll('img').length, 10);
        var rem = parseInt(this.classList[0], 10);
		if (num - (rem - 1) > 2) {
     	    info.innerHTML = 'Legfeljebb 2 ábrát választhatsz. ';						
		} else {
     	  if (parent.classList[1] === "pileOne") {
     	    info.innerHTML = 'Ha ezt választod, akkor ' + (num - (rem - 1)) +
               ' bábut változtatunk át házikóvá.';			
 		  } else {			
     	    info.innerHTML = 'Ha ezt választod, akkor ' + (num - (rem - 1)) +
               ' házikót veszünk el.';			
 		  }			
		}
    }


    var makeMove = function() {
		if (document.querySelector('.whos').innerHTML === "Mi jövünk.") {			
		  console.error('Túl gyorsan léptél, még mi jövünk.');
		} else {
          var pile = this.parentElement.classList[1];
          var matches = this.classList[0];
          var num = parseInt(this.parentElement.querySelectorAll('img').length, 10);
          var rem = parseInt(this.classList[0], 10);
		  var diff = num - (rem - 1);
		  var numOfPileOne = document.getElementById("pileOne").querySelectorAll('img').length;
		  var numOfPileTwo = document.getElementById("pileTwo").querySelectorAll('img').length;
  		  var move = {};
		  if (diff < 3) {
     	    if (pile === "pileOne") {
              move["pileOne"] = (matches - 1);
              move["pileTwo"] =  numOfPileTwo + diff;
 		    } else {			
              move[pile] = (matches - 1);
 		    }
            pubSub.pub('PLAYER_MOVE', move);
		    }
		 }
    }


    var appendEventsToBoard = function() {
        var imgs = container.getElementsByTagName('img');
        for (var i = imgs.length - 1; i >= 0; i--) {
            imgs[i].onmouseover = hoverEvent;
            imgs[i].onclick = makeMove;
        };
    };

    var emptyPile = function(el) {
        if (el && el.firstChild) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    }

    var drawBoard = function(board) {
       
        //loop through the board
        for (var i in board) {
            if (board.hasOwnProperty(i) && typeof i !== 'undefined') {
                //get images
				var frag;
				var serverPrefix = '/wp-includes/js/nim/';
			    //var serverPrefix = '';
                if (i === "pileOne") {
                  frag = drawPile(board[i], serverPrefix + 'red_circle.png');
			    } else {
                  frag = drawPile(board[i], serverPrefix + 'blue_circle.png');
 				}
                //append images to the pile
                emptyPile(container.querySelector('.' + i));
                container.querySelector('.' + i).appendChild(frag);
            }
        }
        appendEventsToBoard();
    };

    return {
        drawBoard: drawBoard,
    }
}

var game = (function() {
    var board = gameBoard();
    var ai = nimAi();
    var n = nim();

    pubSub.sub('PLAYER_MOVE', function(move) {
        board.drawBoard(n.move(move));
        checkGame();
		var time = Math.floor(Math.random() * 1500 + 1500);
    	    setTimeout(aiMove, time);
    });

    var checkGame = function() {
        document.querySelector('.whos').innerHTML = n.status().player;
        if(!n.status().isGameOn) {
            document.querySelector('.move').innerHTML = '';
            //document.querySelector('.repeat').style.display = '';
        }
		n.isBeginningOfGame = false;
    }

    var aiMove = function() {
        var aiMove =  ai.makeMove(n.board(), n.isBeginningOfGame);
        n.move(aiMove);
      	board.drawBoard(n.board());
        checkGame();
    }

    var start = function() {
       document.querySelector('.game').style.display = 'block';
       document.querySelector('.whos').innerHTML = n.status().player;
    	   board.drawBoard(n.board());
    }

    var reset = function() {
        n.reset();
 	    n.playerOne = true;
	    n.isBeginningOfGame = true;
        //document.querySelector('.whos').innerHTML = 'Te jössz.';

        //document.querySelector('.repeat').style.display = 'none';
        
        start();
    }

    return {
    	reset : reset,
    	start : start
    }

})();
window.game = game;
