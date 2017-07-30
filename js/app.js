// dimensions of the game area
var numRows = 6;
var numCols = 5;

// pixel size of each board piece
var fieldX = 101; // pixel width of each board piece
var fieldY = 83; // pixel height of each board piece

// global variables indicating if a message should be shown to the player, and for how long
var message = 'Welcome';
var messageTimer = 1;

// Enemies our player must avoid
var Enemy = function() {
    this.x = (-1)*fieldX;
    this.y = (Math.floor(Math.random() * 3)+1)*fieldY; // random street row of the board
    this.speed = ((Math.floor(Math.random() * 200))+100)*0.5; // random speed
    this.active = true; // if set to false, Enemy will be removed and replaced during updating

    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if(this.x>(numCols*fieldX)) {
        this.active = false;
    };

    // check whether this Enemy hits the player
    var leftBound = Math.min(this.x,player.fx*fieldX);
    var upBound = Math.min(this.y,player.fy*fieldY);
    // collission occurs if both are within the fieldX/fieldY box of these bouds
    if((this.x<(leftBound+fieldX)) && ((player.fx*fieldX)<(leftBound+fieldX)) && ((this.y<(upBound+fieldY))) && ((player.fy*fieldY)<(upBound+fieldY))) {
        message = 'Collision!';
        messageTimer = 1;
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class

var Player = function() {
    this.reset();
    this.sprite = 'images/char-boy.png';
};

// initalises or resets player position
Player.prototype.reset = function() {
    // since player can only move in full board pieces, a Player object saves the field the player is in, not the derived x and y coordinates for the sprite
    this.fx = 2;
    this.fy = 5;    
}

// since player movement only takes place during key handling, this function only checks whether the player has reached the water
Player.prototype.update = function(dt) {
    if(this.fy===0) {
        message = 'You made it!';
        messageTimer = 1;
        this.reset();
    }
};

// move player by one field if arrow key is pressed
Player.prototype.handleInput = function(key) {
    if(key==='left') {
        if(this.fx>0) {
            this.fx--;
        }
    }
    else if(key==='right') {
        if(this.fx<(numCols-1)) {
            this.fx++;
        }
    }
    else if(key==='up') {
        if(this.fy>0) {
            this.fy--;
        }
    }
    else if(key==='down') {
        if(this.fy<(numRows-1)) {
            this.fy++;
        }
    }
};

// actual drawing position must be calculated from player's current board piece and the size of each board piece
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.fx*fieldX, this.fy*fieldY);    
}

// Instantiating game objects.

var player = new Player();
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
