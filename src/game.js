var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('lvl1', 'lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('base_tile_img', 'assets/sprites.png');


    game.load.image('door_closed','assets/door_closed.png');
    game.load.image('door_open','assets/door_open.png');
    game.load.image('key','assets/keyYellow.png');    

    game.load.image('cloud1','assets/cloud1.png');    
    game.load.image('cloud2','assets/cloud2.png');    
    game.load.image('cloud3','assets/cloud3.png');    

    game.load.spritesheet('player_walk', 'assets/walk.png', 66, 92, 13);

}

//IO
var cursors;
var jumpButton;

//player
var player;
var facing = 'right';
var jumpTimer = 0;
var isJumping = false;

//background
var bg;

//objects
var door_closed;
var door_open;
var key;
var hasKey;

//text
// var winText;
// var timerText;
// var startTime = 0;
// var best = 0;

//clouds
var clouds = [];



function create() {
    //setupFullscreen();

    initializePhysics();    
    initializeIO();

    createBackground();
    createClouds();
    initializeTerrain();
    createObjects();
    createPlayer();
    // createTexts();
}

// function setupFullscreen() {
//     game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
//     game.input.onDown.add(gofull, this);
// }


// function gofull() {
//     if (game.scale.isFullScreen)
//     {
//         game.scale.stopFullScreen();
//     }
//     else
//     {
//         game.scale.startFullScreen(false);
//     }
// }

function initializePhysics() {
    game.physics.startSystem(Phaser.Physics.ARCADE);    
    game.physics.arcade.gravity.y = 1000;
}

function initializeIO() {
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function initializeTerrain() {
    map = game.add.tilemap('lvl1');
    map.addTilesetImage('base', 'base_tile_img' );
    map.setCollisionBetween(0, 200);

    terrainLayer = map.createLayer('Terrain');
    objectsLayer = map.createLayer('Objects');

    terrainLayer.resizeWorld();
    objectsLayer.resizeWorld();
}


function createPlayer() {

    player = game.add.sprite(340, 1000, 'player_walk');
    player.animations.add('walk', [2,3,4,5,6,7,8,9,10,11,12], 15, true);
    player.animations.add('jump', [1]);
    player.animations.add('stop', [0]);
    player.anchor.setTo(.5,.5);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    //player.body.bounce.y = 0.2;
    player.body.maxVelocity.y = 750;
    //player.body.collideWorldBounds = true;
    
    game.camera.follow(player);

}

// function createTexts() {
//     winText = game.add.text(game.camera.width/2, game.camera.height/2 - 100, 'You Win!');
//     winText.fixedToCamera = true;

//     //  Center align
//     winText.anchor.set(0.5);
//     winText.align = 'center';

//     //  Font style
//     winText.font = 'Arial Black';
//     winText.fontSize = 50;
//     winText.fontWeight = 'bold';

//     //  Stroke color and thickness
//     winText.stroke = '#000000';
//     winText.strokeThickness = 8;
//     winText.fill = '#66ff99';

//     winText.visible = false;

//     timerText = game.add.text(game.camera.width - 20, 40, '0');
//     timerText.fixedToCamera = true;
//     timerText.anchor.set(1);
//     timerText.align = 'right';
//     timerText.font = 'Arial';
//     timerText.fontSize = 16;
//     timerText.stroke = '#000000';
//     timerText.strokeThickness = 2;
//     timerText.fill = '#ffffff';
// }


function createObjects() {
    door_closed = game.add.sprite(210, 1050, 'door_closed');
    door_open = game.add.sprite(210, 1050, 'door_open');
    door_open.visible = false;

    key = game.add.sprite(5150, 150, 'key');

    hasKey = game.add.sprite(10, 10, 'key');
    hasKey.fixedToCamera = true;
    hasKey.visible = false;
    hasKey.scale.setTo(0.5, 0.5);
}

function createBackground() {

    var bgBitmap = game.add.bitmapData(game.width, game.height);

    var grd=bgBitmap.context.createLinearGradient(0,0,0,500);
    grd.addColorStop(0,"#EF5091");
    grd.addColorStop(1,"white");
    bgBitmap.context.fillStyle=grd;
    bgBitmap.context.fillRect(0,0,this.game.width, this.game.height);

    var bg = game.add.sprite(0, 0, bgBitmap);
    bg.fixedToCamera = true;
}


function rand(a, b) {
    var d = b-a+1;
    return Math.floor(Math.random()*d)+a;
}

function createClouds() {
    var count = rand(3,10);
    for(var i = 0; i <  count; i++) {
        var type = rand(1,3);
        var cx = rand(0, game.width*3);
        var cy = rand(0, game.height/3);
        var c = game.add.sprite(cx, cy, 'cloud'+type);
        c.fixedToCamera = true;
        c.parallax = Math.floor(i/2);
        c.x1 = cx;
        clouds.push(c);
    }
}

function reset() {
    player.x = 320;
    player.y = 1000; 

    door_closed.visible = true;
    door_open.visible = false;
    hasKey.visible = false;
    // winText.visible = false;
    key.visible = true;

    startTime = game.time.now;
}

function update() {
    // collision detection
    game.physics.arcade.collide(player, terrainLayer);
    
    // cloud parallax
    for(var i=0; i<clouds.length; i++){
        clouds[i].cameraOffset.x = clouds[i].x1 - 50 * game.camera.x / game.width * clouds[i].parallax;
    }

    // object interactions
    if(game.physics.arcade.intersects(player, key) && key.visible === true) {
        hasKey.visible = true;
        key.visible = false;
    }

    if(game.physics.arcade.intersects(player, door_closed)) {
        if(hasKey.visible === true) {
            door_closed.visible = false;
            door_open.visible = true;
            hasKey.visible = false;
            // winText.visible = true;
        }
    }

    // player movement

    //slide
    if(player.body.velocity.x > 7 && player.body.velocity.x < 7) {
        player.body.velocity.x = 0;
    }

    if(player.body.velocity.x < 0) {
        player.body.velocity.x += 7;
    } else if(player.body.velocity.x != 0) {
        player.body.velocity.x -= 7;
    }

    //bounce 
    //player.body.bounce.set(0.2);

    //regular movement
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;

        if (facing != 'left' || isJumping && game.time.now > jumpTimer)
        {
            player.animations.play('walk');
            facing = 'left';
            player.scale.x = -1
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;

        if (facing != 'right' || isJumping && game.time.now > jumpTimer)
        {
            player.animations.play('walk');
            facing = 'right';
            player.scale.x = 1
        }
    }
    else
    {
        if(player.body.onFloor()) {
            player.animations.play('stop');
        }
        if (facing != 'idle')
        {

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if(player.body.onFloor()) {
        isJumping = false;
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.animations.play('jump');
        player.body.velocity.y = -750;
        jumpTimer = game.time.now + 1000;
        isJumping = true;
    }


    // death
    if(player.body.y > 1400) { 
        reset();
    }

}

function render() {
    // if(winText.visible === false) {
    //     var timePassed = game.time.now - startTime;
    //     timerText.text = msToTime(timePassed);
    // }

    //game.debug.spriteInfo(player, 32, 32);
}


// function msToTime(duration) {
//     var milliseconds = parseInt((duration%1000))
//         , seconds = parseInt((duration/1000)%60)
//         , minutes = parseInt((duration/(1000*60))%60)
//         , hours = parseInt((duration/(1000*60*60))%24);

//     if(milliseconds < 100) milliseconds = "0" + milliseconds;
//     if(milliseconds < 10) milliseconds = "0" + milliseconds;
//     minutes = (minutes < 10) ? "0" + minutes : minutes;
//     seconds = (seconds < 10) ? "0" + seconds : seconds;

//     return minutes + ":" + seconds + "." + milliseconds;
// }