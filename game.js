var gameSettings = {
    playerSpeed: 200
}

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#1a1a1a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: [Scene1, Scene2, Scene3],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
}


var game = new Phaser.Game(config);