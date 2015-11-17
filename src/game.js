var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('lvl1', 'lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('base_tile_img', 'assets/sprites.png');
}


function create() {
    initializeTerrain();
}


function initializeTerrain() {
    map = game.add.tilemap('lvl1');
    map.addTilesetImage('base', 'base_tile_img' );
    map.setCollisionBetween(0, 200);

    terrainLayer = map.createLayer('Terrain');
    objectsLayer = map.createLayer('Objects');

    terrainLayer.resizeWorld();
    objectsLayer.resizeWorld();

    game.camera.x = 0;
    game.camera.y = 1000;
}


function update() {
}

function render() {
}

