function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
  this.nextState = [];
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
  // each board cell has an CSS id in the format of: "x-y" 
  // where x is the x-coordinate and y the y-coordinate
  // use this fact to loop through all the ids and assign
  // them "on-click" events that allow a user to click on 
  // cells to setup the initial state of the game
  // before clicking "Step" or "Auto-Play"
  
  // clicking on a cell should toggle the cell between "alive" & "dead"
  // for ex: an "alive" cell be colored "blue", a dead cell could stay white
  
  // EXAMPLE FOR ONE CELL
  // Here is how we would catch a click event on just the 0-0 cell
  // You need to add the click event on EVERY cell on the board
  
  var onCellClick = function (e) {
    // coordinates of cell, in case you need them
    var coord_array = this.id.split('-');
    var coord_hash = {x: coord_array[0], y: coord_array[1]};
    
    // how to set the style of the cell when it's clicked
    if (this.getAttribute('data-status') == 'dead') {
      this.className = "alive";
      this.setAttribute('data-status', 'alive');
    } else {
      this.className = "dead";
      this.setAttribute('data-status', 'dead');
    }
  };

  //var cell00 = document.getElementById('0-0');
  //cell00.onclick = onCellClick;
  for (var y = 0; y < this.height; y ++) {
  	for (var x = 0; x < this.width; x ++) {
			var cellXY = document.getElementById(x + '-' + y);
			cellXY.onclick = onCellClick;
		}
  }

	// setup board buttons
	var stepButton = document.getElementById('step');
	var clearButton = document.getElementById('clear');
	var playButton = document.getElementById('play');
	var resetButton = document.getElementById('resetR');
	var loadPatternButton = document.getElementById('loadPattern');
	// setup buttons' click events
  /* 
	stepButton.onclick = this.step;
	clearButton.onclick = this.clearBoard;
	playButton.onclick = this.enableAutoPlay;
	resetButton.onclick = this.resetRandom;
	*/
  stepButton.onclick = this.step.bind(this);
	clearButton.onclick = this.clearBoard.bind(this);
	playButton.onclick = this.enableAutoPlay.bind(this);
	resetButton.onclick = this.resetRandom.bind(this);
	loadPatternButton.onclick = this.shapeLoader.bind(this);
};

GameOfLife.prototype.clearBoard = function(){
	var self = this;
	this.forEach(function(cellXY){
		cellXY.setAttribute('data-status', 'dead');
		cellXY.className = 'dead';
	}); 
}

GameOfLife.prototype.resetRandom = function(){
	var numberOfRandomCells = 2000;
    for (var i = 0; i < numberOfRandomCells; i++) {
        randomX = Math.floor(Math.random() * this.width);
        randomY = Math.floor(Math.random() * this.height);
        var randomID = randomX + '-' + randomY;
        var randomCellXY = document.getElementById(randomID);
        randomCellXY.setAttribute('data-status', 'alive');
        randomCellXY.className = 'alive';
    }
}

GameOfLife.prototype.forEach = function(func){
	for (var y = 0; y < this.height; y ++){
		for (var x = 0; x < this.width; x ++){
      var cellID = x + '-' + y;
			var cellXY = document.getElementById(cellID);
			func(cellXY, x, y);
		}
	}
}

GameOfLife.prototype.countLives = function( x, y){
		var liveCount = 0;
		for (var i = x - 1; i <= x + 1; i ++){
			for (var j = y - 1; j <= y +1; j ++){
        var cellNeighborID = i + '-' + j;
				var cellNeighbor = document.getElementById(cellNeighborID);
				if (cellNeighbor && cellNeighbor.getAttribute('data-status') == 'alive')
						liveCount ++;
			}
		}
	return liveCount;
}

GameOfLife.prototype.step = function () {
  // Here is where you want to loop through all the cells
  // on the board and determine, based on it's neighbors,
  // whether the cell should be dead or alive in the next
  // evolution of the game
  // console.log('step');	
	var self = this;
	self.nextState = [];
  this.forEach(function(cellXY, x, y){
		if (cellXY.getAttribute('data-status') == 'alive'){
			var aliveCountNeighbor = self.countLives(x, y);
			if (aliveCountNeighbor < 3 || aliveCountNeighbor > 4){
				//cellXY.setAttribute('data-status', 'dead');
				//cellXY.className = 'dead';
        cellXY.setAttribute('next-state', 'dead');
        self.nextState.push(cellXY);
			}
		};
		if (cellXY.getAttribute('data-status') == 'dead'){
			var aliveCountNeighbor = self.countLives(x, y);
			if (aliveCountNeighbor == 3){
				//cellXY.setAttribute('data-status', 'alive');
				//cellXY.className = 'alive';
		    cellXY.setAttribute('next-state', 'alive');
        self.nextState.push(cellXY);
      }
		};
	});
  //this.updateState();
  // console.log('start update state');
  var nextStateArr = this.nextState;
  for(var i = 0; i < nextStateArr.length; i ++){
    // console.log('dead' + i);
    if (nextStateArr[i].getAttribute('next-state') == 'dead'){
      nextStateArr[i].setAttribute('data-status', 'dead');
      nextStateArr[i].setAttribute('next-state', 'none');
      nextStateArr[i].className = 'dead';
    }else if (nextStateArr[i].getAttribute('next-state') == 'alive'){
      // console.log('alive' + i);
      nextStateArr[i].setAttribute('data-status', 'alive');
      nextStateArr[i].setAttribute('next-state', 'none');
      nextStateArr[i].className = 'alive';
    }
  }

};

GameOfLife.prototype.updateState = function(){
  var nextStateArr = this.nextState;
  for(var i = 0; i < nextStateArr.len; i ++){
    if (nextStateArr[i].getAttritube('next-state') == 'dead'){
      nextStateArr[i].setAttribute('data-status', 'dead');
      nextStateArr[i].setAttribute('next-state', 'none');
    }else if (nextStateArr[i].getAttritube('next-state') == 'alive'){
      nextStateArr[i].setAttribute('data-status', 'alive');
      nextStateArr[i].setAttribute('next-state', 'none');
    }
  }
}
/*
GameOfLife.prototype.step = function () {
  // Here is where you want to loop through all the cells
  // on the board and determine, based on it's neighbors,
  // whether the cell should be dead or alive in the next
  // evolution of the game
	for (var y = 0; y < this.height; y ++){
		for (var x = 0; x < this.width; x ++){
			var cellXY = document.getElementById(x + '-' + y);
			if (cellXY.getAttribute('data-status') == 'alive'){
				var liveCount = 0;
				for (var i = x - 1; i <= x + 1; i ++){
						for (var j = y - 1; j <= y +1; j ++){
							var cellNeighbor = document.getElementById(i + '-' + j);
							if (cellNeighbor){	
								if (cellNeighbor.getAttribute('data-status') == 'alive')
									liveCount ++;
							}
						}
				}
				if (liveCount < 3 || liveCount > 4){
					cellXY.setAttribute('data-status', 'dead');
					cellXY.className = 'dead';
				}
			}
			if (cellXY.getAttribute('data-status') == 'dead'){
				var liveCount = 0;
				for (var i = x - 1; i <= x + 1; i ++){
						for (var j = y - 1; j <= y +1; j ++){
							var cellNeighbor = document.getElementById(i + '-' + j);
							if(cellNeighbor){
								if (cellNeighbor.getAttribute('data-status') == 'alive')
									liveCount ++;
							}
						}
				}
				if (liveCount == 3){
					cellXY.setAttribute('data-status', 'alive');
					cellXY.className = 'alive';
				}
			}
		}
	}  
};
*/


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
					var id = (j + 50) + '-' + (i + 50);
					arrayWithCoordinatesToActivate.push(id);
					//console.log(id);
				}
				// var arrayWithCoordinatesToActivate = [];

			}
			// console.log(currentLine);
		}
	}
	return arrayWithCoordinatesToActivate;
}

// formatTemplateArray(bomberTemplateArray);

// parseTemplateArray(bomberTemplateArray);
//End loader code

GameOfLife.prototype.shapeLoader = function(){
	var arrayWithCoordinatesToActivate = parseTemplateArray(bomberTemplateArray);
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
	setInterval(function(){
		self.step();
	}, 500);
};

var gol = new GameOfLife(200,200);
gol.createAndShowBoard();
