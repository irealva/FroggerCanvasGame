
var MAX_X = 505 ;
var MIN_X = -100 ;
var MAX_Y = 606 ;
var COL_WIDTH = 101 ;
var ROW_WIDTH = 83 ;

var PLAYER_INITIAL_COL = 2 * COL_WIDTH ;
var PLAYER_INITIAL_ROW = 4.75 * ROW_WIDTH ;

var global_score = 0 ;

var update_score = function() {
    global_score++ ;
    console.log(global_score) ;
    return global_score ;
}


// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x ;
    this.y = y ;
    this.speed = speed ;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > MAX_X)
    {
        this.x = MIN_X ;
    }

    this.x += this.speed * dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


//Player class
var Player = function(x,y) {
    this.sprite = 'images/char-boy.png' ;
    this.x = x; // 5 columns total
    this.y = y; // 6 rows total
}

//Update the player's position, required method for game
//Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    checkCollision() ;
}

//Draw a player on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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
    if (this.y < 0) {
        player.x = PLAYER_INITIAL_COL ;
        player.y = PLAYER_INITIAL_ROW ;
        global_score = 0 ; 
        $("#score").replaceWith("<div id='score'><h2>Score: " + global_score + " </h2></div>") ;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


//Function to check if player collides with enemy
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


//Jewel class
var Jewel = function(x,y) {
    this.sprite = 'images/gem-green.png' ;
    this.x = (x*COL_WIDTH) + 15 ;
    this.y = (y*ROW_WIDTH) ;
}

//Update the jewel's position, required method for game
//Parameter: dt, a time delta between ticks
Jewel.prototype.update = function(dt) {
    checkCapture() ;
}

//Draw a player on the screen, required method for game
Jewel.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var checkCapture = function(){
  	if ((round(player.y) == round(jewel.y)) && (round(player.x)==round(jewel.x))) {
            //console.log("jewel x : " + round(jewel.x) + "jewel y:" + round(jewel.y)) ;
            //console.log("player x: "+ round(player.x) + "player y:" + round(player.y)) ;
            //console.log("caught") ;
            jewel.x = (ranCol()*COL_WIDTH) + 15 ;
            jewel.y = ranRow()*ROW_WIDTH ;
            $("#score").replaceWith("<div id='score'><h2>Score: " + update_score() + " </h2></div>") ;
        }

}

var round = function(x) {
    return Math.floor(x / 100) * 100 ;
}

var ranCol = function() {
    return Math.floor((Math.random() * 4)); // x = 0 -4
}

var ranRow = function() {
    return Math.floor((Math.random() * 3) + 1); //y = 1-3
}



// Now instantiating objects.

$("#score").append("<h2>Score: " + global_score + " </h2>") ;

// Place all enemy objects in an array called allEnemies
var enemy1 = new Enemy(1*COL_WIDTH, 0.75*ROW_WIDTH, 100) ;
var enemy2 = new Enemy(2*COL_WIDTH, 1.75*ROW_WIDTH, 200) ;
var allEnemies = [] ;
allEnemies.push(enemy1) ;
allEnemies.push(enemy2) ;

var jewel = new Jewel(ranCol(), ranRow()) ; // x = 0-4, y = 1-3

// Place the player object in a variable called player
var player = new Player(PLAYER_INITIAL_COL, PLAYER_INITIAL_ROW) ;



