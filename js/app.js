/** app.js
 * Game functionality for a frogger game
 * @author Irene Alvarado
 */

var MAX_X = 505 ; //canvas width
var MIN_X = -100 ; // left most position for an enemy object
var MAX_Y = 606 ; // canvas height 
var COL_WIDTH = 101 ; //width of a canvas column (5 columns total)
var ROW_WIDTH = 83 ; //height of a canvas row (6 rows total)

var PLAYER_INITIAL_COL = 2 * COL_WIDTH ; // initial 'x' position for a player
var PLAYER_INITIAL_ROW = 4.75 * ROW_WIDTH ; // intiial 'y' position for a player

var global_score = 0 ; // score counter

/**
 * Returns the total game score
 * @return {integer} game score
 */
var update_score = function() {
    global_score++ ;
    console.log(global_score) ;
    return global_score ;
}

/**
 * Enemy object class
 * @param {integer} x X position for an enemy object
 * @param {integer} y Y position for an enemy object
 * @param {integer} speed Speed for an enemy object
 * @constructor
 */
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x ;
    this.y = y ;
    this.speed = speed ;
}

/**
 * Update the enemy's position, required method for game
 * @param {float} dt A time delta between ticks. Game movement is multiplied by dt paramenter
 * to ensure that game runs at the same speed for all computers.
 */
Enemy.prototype.update = function(dt) {
    if(this.x > MAX_X)
    {
        this.x = MIN_X ;
    }

    this.x += this.speed * dt;
}

/**
 * Draws the enemy on a screen, required method for the game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/**
 * Player object class
 * @param {integer} x X position for a player object
 * @param {integer} y Y position for a player object
 * @constructor
 */
var Player = function(x,y) {
    this.sprite = 'images/char-boy.png' ;
    this.x = x; 
    this.y = y; 
}


/**
 * Update the players's position, required method for game
 */
Player.prototype.update = function() {
    checkCollision() ;
}

/**
 * Draw a player on the screen, required method for game
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Handles player input to move player up, down, right, or left
 * @param {string} key Represents direction moved
 */
Player.prototype.handleInput = function(key) {
    console.log(key) ;
    if (key == "up") {
        this.y = this.y - ROW_WIDTH ;
    }
    if (key == "down" && ((this.y + ROW_WIDTH) <= PLAYER_INITIAL_ROW)) {
        this.y = this.y + ROW_WIDTH ;
        console.log(this.y) ;
    }
    if (key == "right" && ((this.x + COL_WIDTH) < MAX_X)) {
        this.x = this.x + COL_WIDTH ;
    }
    if (key == "left" && ((this.x - COL_WIDTH) >= 0)) {
        this.x = this.x - COL_WIDTH ;
    }
    if (this.y < 0) { // if player falls into the water, game restarts
        player.x = PLAYER_INITIAL_COL ;
        player.y = PLAYER_INITIAL_ROW ;
        global_score = 0 ; 
        $("#score").replaceWith("<div id='score'><h2>Score: " + global_score + " </h2></div>") ;
    }
}

/**
 * Listens for key presses and sends the keys to Player.handleInput()
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * Checks if player collides with enemy objects
 */
var checkCollision = function() {
    //console.log("player ROW " + player.x) ;

    for(var enemies in allEnemies) {
        //console.log("enemy ROW" + allEnemies[enemies].x) ;
        if (((player.x+18) < (allEnemies[enemies].x+(101-2))) && ((player.x+84) > (allEnemies[enemies].x+2)) &&
        (player.y == allEnemies[enemies].y)) {
            player.x = PLAYER_INITIAL_COL ;
            player.y = PLAYER_INITIAL_ROW ;
            global_score = 0 ; 
            $("#score").replaceWith("<div id='score'><h2>Score: " + global_score + " </h2></div>") ;
        }
    }
}


/**
 * Jewel object class
 * @param {integer} x X position for a jewel object
 * @param {integer} y Y position for a jewel object
 * @constructor
 */
var Jewel = function(x,y) {
    this.sprite = 'images/gem-green.png' ;
    this.x = (x*COL_WIDTH) + 15 ;
    this.y = (y*ROW_WIDTH) ;
}


/**
 * Update the jewel's position, required method for game
 */
Jewel.prototype.update = function() {
    checkCapture() ;
}

/**
 * Draw a jewel on the screen, required method for game
 */
Jewel.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Checks if player captures a jewel object
 */
var checkCapture = function(){
  	if ((round(player.y) == round(jewel.y)) && (round(player.x)==round(jewel.x))) {
            jewel.x = (ranCol()*COL_WIDTH) + 15 ;
            jewel.y = ranRow()*ROW_WIDTH ;
            $("#score").replaceWith("<div id='score'><h2>Score: " + update_score() + " </h2></div>") ;
        }

}

/**
 * Helper function to round out a player and jewel's X position
 */
var round = function(x) {
    return Math.floor(x / 100) * 100 ;
}

/**
 * Returns a random column number
 * @return {integer} Column number from 0 to 4
 */
var ranCol = function() {
    return Math.floor((Math.random() * 4)); 
}

/**
 * Returns a random row number
 * @return {integer} row number from 1 to 3
 */
var ranRow = function() {
    return Math.floor((Math.random() * 3) + 1); 
}



// Now instantiating objects for the game
$("#score").append("<h2>Score: " + global_score + " </h2>") ; //appends a counter

// Places all enemy objects in an array called allEnemies
var enemy1 = new Enemy(1*COL_WIDTH, 0.75*ROW_WIDTH, 100) ;
var enemy2 = new Enemy(2*COL_WIDTH, 1.75*ROW_WIDTH, 200) ;
var allEnemies = [] ;
allEnemies.push(enemy1) ;
allEnemies.push(enemy2) ;

//Creates a jewel object
var jewel = new Jewel(ranCol(), ranRow()) ;

//Creates a player object
var player = new Player(PLAYER_INITIAL_COL, PLAYER_INITIAL_ROW) ;



