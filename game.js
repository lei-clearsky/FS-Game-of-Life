function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
  this.nextState = [];
  this.autoPlay = null;
}

GameOfLife.prototype.createAndShowBoard = function () {
  // create <table> element
  var goltable = document.createElement("tbody");
  
  // build Table HTML
  var tablehtml = '';
  for (var h=0; h<this.height; h++) {
    tablehtml += "<tr id='row+" + h + "'>";
    for (var w=0; w<this.width; w++) {
      tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
    }
    tablehtml += "</tr>";
  }
  goltable.innerHTML = tablehtml;
  
  // add table to the #board element
  var board = document.getElementById('board');
  board.appendChild(goltable);
  
  // once html elements are added to the page, attach events to them
  this.setupBoardEvents();
};

GameOfLife.prototype.setupBoardEvents = function() {

  var onBoardClick = function (eventInfo) {

    var cell = eventInfo.target;
   
    if (cell.getAttribute('data-status') == 'dead') {
      cell.className = "alive";
      cell.setAttribute('data-status', 'alive');
    } else {
      cell.className = "dead";
      cell.setAttribute('data-status', 'dead');
    }
  };

  var board = document.getElementById('board');
  board.onclick = onBoardClick;

	// setup board buttons
	var stepButton = document.getElementById('step');
	var clearButton = document.getElementById('clear');
	var playButton = document.getElementById('play');
	var resetButton = document.getElementById('resetR');
	var loadPatternButton = document.getElementById('loadPattern');
	// setup buttons' click events
  stepButton.onclick = this.step.bind(this);
	clearButton.onclick = this.clearBoard.bind(this);
	playButton.onclick = this.enableAutoPlay.bind(this);
	resetButton.onclick = this.resetRandom.bind(this);
	loadPatternButton.onclick = this.shapeLoader.bind(this);
  //loadPatternButton.onclick = this.testAjax.bind(this);

};

GameOfLife.prototype.clearBoard = function(){
	var self = this;
	this.forEach(function(cell){
		cell.setAttribute('data-status', 'dead');
		cell.className = 'dead';
	}); 
}

GameOfLife.prototype.resetRandom = function(){
  this.forEach(function(cell, x, y) {
    if (Math.random() < .5) {
      cell.className = "alive";
      cell.setAttribute('data-status', 'alive');
    } else {
      cell.className = "dead";
      cell.setAttribute('data-status', 'dead');
    }
  });
}

GameOfLife.prototype.forEach = function(func){
  var cellID, cell;
	for (var y = 0; y < this.height; y ++){
		for (var x = 0; x < this.width; x ++){
      var cellID = x + '-' + y;
			var cell = document.getElementById(cellID);
			func(cell, x, y);
		}
	}
}

GameOfLife.prototype.step = function () {

  this.forEach(function(cell, x, y){

    var aliveNeighbors = 0, neigh_id, ncell;

    for (var i = -1; i <=1; i ++) {
      for (var j = -1; j <=1; j ++) {
        neigh_id = (x+i) + "-" + (y+j);
        if(neigh_id !== cell.id) {
          ncell = document.getElementById(neigh_id);
          if (ncell && ncell.getAttribute('data-status') === "alive") {
            aliveNeighbors ++;
          }
        }
      }
    }

    cell.setAttribute('data-neighbors', aliveNeighbors);

  });

	var determineNextState = function (cell) {
    var currState = cell.getAttribute('data-status');
    var numNeighbors = parseInt(cell.getAttribute('data-neighbors'));
    var nextState = currState;

    if (currState === "alive" && (numNeighbors < 2 || numNeighbors > 3)) {
      nextState = "dead";
    } else if (currState === "dead" && numNeighbors === 3) {
      nextState = "alive";
    }
    return nextState;
  };

  this.forEach(function(cell, x, y) {
    var nextState = determineNextState(cell);
    cell.setAttribute('data-status', nextState);
    cell.setAttribute('data-neighbors', -1);
    cell.className = nextState;
  });

};


var bomberTemplateArray = [ '!Name: B-52 bomber',
 '!Author: Noam Elkies',
 '!A period 104 double-barrelled glider gun. It uses a B-heptomino and emits one glider every 52 generations.',
 '!www.conwaylife.com/wiki/index.php?title=B-52_bomber',
 '.OO',
 '.OO.................O',
 '...................O.O............O.O',
 '....................O............O',
 'OO.......OO.......................O..O',
 'OO.O.....OO.......................O.O.O',
 '...O.......................O.......O..O',
 '...O.......................OO.......OO',
 'O..O.................OO.....O',
 '.OO..................O',
 '.....................OOO',
 '....................................OO',
 '....................................OO',
 '.OO',
 'O..O',
 'O.O.O................O.O....OO.....OO',
 '.O..O.................OO....OO.....OO.O',
 '.....O............O...O...............O',
 '..O.O............O.O..................O',
 '..................O................O..O',
 '....................................OO',
 '' ];

var spaceshipTemplateArray = [ '!Name: 10-engine Cordership',
 '!Author: Dean Hickerson',
 '!A c/12 period 96 diagonal Cordership that uses 10 switch engines, which was the fewest possible known at the time of its discovery.',
 '!www.conwaylife.com/wiki/index.php?title=10-engine_Cordership',
 '..........................................O',
 '..........................................O',
 '............................................O.....O',
 '...........................................O......O.O',
 '..........................................O...O..O',
 '...........................................O..O.O.OO',
 '................................................O.OO',
 '..............................................................OO',
 '..............................................................OO',
 '',
 '',
 '',
 '',
 '',
 '',
 '......................................................................OO',
 '..........................OO..O.......................................OO',
 '.............................O.O',
 '............................O',
 '',
 '..............................OO',
 '',
 '...............................OO',
 '..............................O...............................................OO',
 '............................OO.OO.............................................OO',
 '...............................OO',
 '................O............O',
 '................O......................OOO',
 '..................O.....O.............O',
 '.................O......O.O..........O....OO',
 '................O...O..O............O...O',
 '.................O..O.O.OO..........O..O....O.........................................OO',
 '......................O.OO..........O...O...O................................O........OO',
 '.....................................OO.O.OOO...............................O.O',
 '........................................O',
 '.........................................OOOO...............................O..O',
 '..............................OOO..........OO.................................OO',
 '.............................O...O.............................................O',
 '............................O....O',
 '...........................O...O',
 '...........................O..O.OOO',
 '...........................O.......O',
 'OO..O........................O...O.O........................................OO',
 '...O.O.......................O...O.OO.........................................O',
 '..O............................OOO.OO.......................................OO',
 '',
 '....OO',
 '',
 '.....OO',
 '....O',
 '..OO.OO....................................................O.O......O.O',
 '.....OO...................................................O.........O.O',
 '...O.......................................................O..O......O',
 '.............................................................OOO',
 '',
 '',
 '',
 '',
 '...................................................O',
 '..................................................O.O',
 '',
 '..................................................O..O',
 '.......OO...........................................OO',
 '.......OO............................................O',
 '',
 '',
 '',
 '',
 '..................................................OO',
 '....................................................O',
 '...............OO.................................OO',
 '...............OO',
 '',
 '',
 '',
 '',
 '.................................O.O......O.O',
 '................................O.........O.O',
 '.......................OO........O..O......O',
 '.......................OO..........OOO',
 '',
 '',
 '',
 '',
 '',
 '',
 '...............................OO',
 '...............................OO',
 '' ];

var heptapoleTemplateArray = [ '!Name: Heptapole',
 '!The barberpole of length 7.',
 '!www.conwaylife.com/wiki/index.php?title=Heptapole',
 'OO',
 'O.O',
 '',
 '..O.O',
 '',
 '....O.O',
 '',
 '......O.O',
 '.........O',
 '........OO',
 '' ];

var bigshipTemplateArray = [ '!Name: 13-engine Cordership', '!Author: Dean Hickerson', '!The first c/12 diagonal spaceship to be found', '......................................................OOO', '.....................................................O..O', '....................................................O....O', '....................................................O..OOO', '....................................................O.....O', '.....................................................OOOOOOO', '...........................................................O', '...........................................................O', '.........................................................OO............OO', '.......................................................................OO', '', '', '', '', '', '', '...............................................................................OO', '...............................................................................OO', '....................................OOO', '...................................O...O', '..................................O....O', '..................................O..O.O...................................O', '..................................OO.O.O..................................O', '....................................OO.O..O................................O', '......................................OO..O............................................OO', '.......................................OOO.............................................OO', '............................OOO......................................O', '...........................O..O....................................O.O', '..........................O....O..................................OO', '..........................O..OOO', '..........................O.....O..............OOO.......O.O', '...........................OOOOOOO................OOO.....O', '.................................O................OOO..........................................OO', '.................................O.................O..................................O........OO', '...............................OO.....................................................O', '......................................................................................O', '.......................................................................................OO', '.......................................................................................OOO', '.......................................O...............................................OO', '.......................................O', '.......................................O', '........................................OO', '........................................OOO', '........................................OO............................................O', '..........OOO..........................................................................O', '.........O...O........................................................................O', '........O....O....................................................OO', '........O..O.O....................................................OO', '........OO.O.O.........................O...........................O', '..........OO.O..O.....................O.O', '............OO..O.....................O..O', '.............OOO', '..OOO..............................................................OOO.......O.O', '.O..O................................O..O.............................OOO.....O', 'O....O...............................OO.OOO...........................OOO', 'O..OOO.................................OO..O...........................O', 'O.....O...........................OO....O..O', '.OOOOOOO......................OO...O....O.O............OO', '.......O...........OOO.......O......O..................OOO', '.......O..............OOO.....O...OOOOO.....................O', '.....OO...............OOO......O...O........................O', '.......................O...........O..O.....................O', '....................................OO.......................OO', '.............................................................OOO', '....O........................................................OO', '...O.O', '..OO.O', '..OO', '...OOO', '....O.......................................................O', '.....O..O....................................................O', '..O......O..................................................O', '..O......O', '..O....OOO', '', '', '', '', '.........................................OOO.......O.O', '............................................OOO.....O', '.......OO...................................OOO', '.......OO....................................O', '', '', '', '..................................O', '..................................O', '..................................O', '...............OO..................OO', '...............OO..................OOO', '...................................OO', '', '', '', '', '..................................O', '.......................OO..........O', '.......................OO.........O', '' ];

function formatTemplateArray (templateArray) {
	var newArray = [];
	for (var i = 0; i < templateArray.length; i++) {
		var currentLine = templateArray[i];
		if (currentLine[0] === "!") {
			continue;
		} else {
			newArray.push(currentLine);
		}
	}
	return newArray;
}

//This is our loader code
function parseTemplateArray (templateArray) {
	var arrayWithCoordinatesToActivate = [];
	var newArray = formatTemplateArray(templateArray);
	for (var i = 0; i < newArray.length; i++) {
		var currentLine = newArray[i];
		if (currentLine[0] === "!") {
			continue;
		} else {
			for (var j = 0; j < currentLine.length; j++) {
				
				var currentCharacter = currentLine[j];
				if (currentCharacter === "O") {
					var id = (j + 30) + '-' + (i + 30);
					arrayWithCoordinatesToActivate.push(id);
				}
			}
		}
	}
	return arrayWithCoordinatesToActivate;
}
//End loader code

GameOfLife.prototype.shapeLoader = function(){ //data
	var arrayWithCoordinatesToActivate = parseTemplateArray(spaceshipTemplateArray);//data
	for (var i = 0; i < arrayWithCoordinatesToActivate.length; i++) {
		var currentCell;
		currentCoordinate = arrayWithCoordinatesToActivate[i];
		currentCell = document.getElementById(currentCoordinate);
		currentCell.setAttribute('data-status', 'alive');
		currentCell.className = 'alive';
	}
}

GameOfLife.prototype.enableAutoPlay = function () {
  // Start Auto-Play by running the 'step' function
  // automatically repeatedly every fixed time interval
	var self = this;

  if (!this.autoPlay) {
    self.autoPlay = window.setInterval(function () {
      self.step();
    }, 10);
  } else {
    window.clearInterval(this.autoPlay);
    this.autoPlay = null;
  }
};

// ajax test
GameOfLife.prototype.testAjax = function(){
  console.log('test1');
  var self = this;
  var url = 'http://0.0.0.0:3000/bigship';
  $.ajax({
    dataType:'json',
    url: url,
    success: function(data) {
      console.log('test2');
      self.shapeLoader(data);
    },
    error: function(data){
      console.log('test3');
      console.log(data);
    }
  });
}

var gol = new GameOfLife(150,150);
gol.createAndShowBoard();
