class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {

        // LOAD BACKGROUND IMAGE
        this.load.image("background", "assets/images/background.png");

        // LOAD ALL THE ROCKS
        this.load.spritesheet("rock1_big", "assets/sprites/rock1_big.png", {
            frameWidth: 101,
            frameHeight: 84
        });
        this.load.spritesheet("rock1_medium", "assets/sprites/rock1_medium.png", {
            frameWidth: 43,
            frameHeight: 43
        });
        this.load.spritesheet("rock1_small", "assets/sprites/rock1_small.png", {
            frameWidth: 28,
            frameHeight: 28
        });
        this.load.spritesheet("rock2_big", "assets/sprites/rock2_big.png", {
            frameWidth: 101,
            frameHeight: 84
        });
        this.load.spritesheet("rock2_medium", "assets/sprites/rock2_medium.png", {
            frameWidth: 43,
            frameHeight: 43
        });
        this.load.spritesheet("rock2_small", "assets/sprites/rock2_small.png", {
            frameWidth: 28,
            frameHeight: 28
        });

        // LOAD POWERUP STARCOIN
        this.load.spritesheet("starcoin", "assets/sprites/starcoin.png", {
            frameWidth: 200,
            frameHeight: 201
        });

        // LOAD PLAYER
        this.load.spritesheet("player", "assets/sprites/player.png", {
            frameWidth: 99,
            frameHeight: 75
        });

        // LOAD PROJECTILE
        this.load.spritesheet("projectile", "assets/sprites/projectile.png", {
            frameWidth: 67,
            frameHeight: 75
        });

        // LOAD ENEMY SHIPS
        this.load.spritesheet("enemy1", "assets/sprites/enemy1.png", {
            frameWidth: 93,
            frameHeight: 84
        });

        this.load.spritesheet("enemy2", "assets/sprites/enemy2.png", {
            frameWidth: 104,
            frameHeight: 84
        });

        this.load.spritesheet("enemy3", "assets/sprites/enemy3.png", {
            frameWidth: 103,
            frameHeight: 84
        });

        // LOAD EXPLOSION
        this.load.spritesheet("explosion", "assets/sprites/explosion.png", {
            frameWidth: 96,
            frameHeight: 96
        });

        // LOAD SOUND EFFECTS
        this.load.audio("projectile_explosionSFX", "assets/sounds/projectileExplosion.mp3");
        this.load.audio("collision_explosionSFX", "assets/sounds/collisionExplosion.wav");
        this.load.audio("projectile_fireSFX", "assets/sounds/projectileFire.ogg");
        this.load.audio("coin_pickupSFX", "assets/sounds/coinPickup.wav");
        this.load.audio("respawnSFX", "assets/sounds/respawn.wav");
        this.load.audio("deathSFX", "assets/sounds/death.wav");

        // LOAD HTML FORM
        this.load.html('nameform', 'assets/text/inputForm.html');

    }

    create() {

        // START GAME BUTTON
        var startText = this.add.text(game.config.width / 2, game.config.height / 2 - 100, "CLICK HERE TO START GAME", { color: 'white', fontSize: '20px ' });
        startText.setOrigin(0.5, 0.5);
        startText.setInteractive();
        startText.on('pointerdown', this.loadGame, this);

        // ADD HTML FORM AND NAME TEXT
        this.setPlayerName();

        // PERSISTENT HIGHSCORE
        this.highScore1 = parseInt(localStorage.getItem('highScore1')) || 0;
        this.highScore2 = parseInt(localStorage.getItem('highScore2')) || 0;
        this.highScore3 = parseInt(localStorage.getItem('highScore3')) || 0;
        this.highScore4 = parseInt(localStorage.getItem('highScore4')) || 0;
        this.highScore5 = parseInt(localStorage.getItem('highScore5')) || 0;
        this.highScoreText = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 40, "HIGHSCORES:");
        this.highScoreText1 = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 60, "1. " + this.playerName + ": " + this.highScore1);
        this.highScoreText2 = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 80, "2. " + this.playerName + ": " + this.highScore2);
        this.highScoreText3 = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 100, "3. " + this.playerName + ": " + this.highScore3);
        this.highScoreText4 = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 120, "4. " + this.playerName + ": " + this.highScore4);
        this.highScoreText5 = this.add.text(game.config.width / 2 - 75, game.config.height / 2 + 140, "5. " + this.playerName + ": " + this.highScore5);
        //this.highScoreText.setText("HIGHSCORE: " + highScore);

    }

    setPlayerName() {
        this.playerName = localStorage.getItem('playerName') || "";
        if (this.playerName == "") {
            var text = this.add.text(game.config.width / 2 - 150, 10, 'PLEASE ENTER YOUR NAME', { color: 'white', fontSize: '20px ' });
            var element = this.add.dom(400, 0).createFromCache('nameform');

            element.addListener('click');

            element.on('click', function (event) {

                if (event.target.name === 'playButton') {
                    var inputText = this.getChildByName('nameField');

                    //  Have they entered anything?
                    if (inputText.value !== '') {
                        //  Turn off the click events
                        this.removeListener('click');

                        //  Hide the login element
                        this.setVisible(false);

                        //  Populate the text with whatever they typed in
                        text.setText('Welcome ' + inputText.value);
                        localStorage.setItem('playerName', inputText.value);
                    }
                    else {
                        //  Flash the prompt
                        this.scene.tweens.add({
                            targets: text,
                            alpha: 0.2,
                            duration: 250,
                            ease: 'Power3',
                            yoyo: true
                        });
                    }
                }

            });

            this.tweens.add({
                targets: element,
                y: 300,
                duration: 3000,
                ease: 'Power3'
            });
        }

        else {
            var text = this.add.text(game.config.width / 2 - 150, 10, "Welcome " + this.playerName, { color: 'white', fontSize: '20px ' });
        }
    }

    // LOAD THE GAME
    loadGame() {
        var loadingText = this.add.text(game.config.width / 2, game.config.height - 100, "Loading...");
        loadingText.setOrigin(0.5, 0.5);
        setTimeout(() => {
            this.scene.start('playGame', {
                highScore1: this.highScore1,
                highScore2: this.highScore2,
                highScore3: this.highScore3,
                highScore4: this.highScore4,
                highScore5: this.highScore5,
                playerName: this.playerName
            });
        }, 1000);
    }
}