class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    init(data) {
        console.log('init', data);
        this.highScore1 = data.highScore1;
        this.highScore2 = data.highScore2;
        this.highScore3 = data.highScore3;
        this.highScore4 = data.highScore4;
        this.highScore5 = data.highScore5;
        this.playerName = data.playerName;
    }

    create() {

        // LOAD THE BACKGROUND
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
        this.background.setOrigin(0, 0);

        // LOAD ROCKS OF TYPE 1
        this.rock1_big = this.add.sprite(game.config.width / 2 - 150, game.config.height / 2, "rock1_big");
        this.rock1_medium = this.add.sprite(game.config.width / 2, game.config.height / 2, "rock1_medium");
        this.rock1_small = this.add.sprite(game.config.width / 2 + 150, game.config.height / 2, "rock1_small");

        // LOAD ROCKS OF TYPE 2
        this.rock2_big = this.add.sprite(game.config.width / 2 - 150, game.config.height / 2 + 100, "rock2_big");
        this.rock2_medium = this.add.sprite(game.config.width / 2, game.config.height / 2 + 100, "rock2_medium");
        this.rock2_small = this.add.sprite(game.config.width / 2 + 150, game.config.height / 2 + 100, "rock2_small");

        // ADD ROCK GROUP
        this.rocks = this.physics.add.group();
        this.rocks.add(this.rock1_big);
        this.rocks.add(this.rock1_medium);
        this.rocks.add(this.rock1_small);
        this.rocks.add(this.rock2_big);
        this.rocks.add(this.rock2_medium);
        this.rocks.add(this.rock2_small);

        // ADD ENEMY SHIPS
        this.enemy1 = this.add.sprite(game.config.width / 2 - 150, game.config.height / 2 + 200, "enemy1");
        this.enemy1.setScale(0.5);
        this.enemy2 = this.add.sprite(game.config.width / 2, game.config.height / 2 + 150, "enemy2");
        this.enemy2.setScale(0.5);
        this.enemy3 = this.add.sprite(game.config.width / 2 + 150, game.config.height / 2 + 150, "enemy3");
        this.enemy3.setScale(0.5);

        // ADD ENEMY SHIPS TO GROUP
        this.enemies = this.physics.add.group();
        this.enemies.add(this.enemy1);
        this.enemies.add(this.enemy2);
        this.enemies.add(this.enemy3);

        // CREATING INITIAL OUT OF FRAME STARCOIN
        this.starcoin = this.add.sprite(-50, -50, "starcoin");
        this.starcoin.setScale(0.15);

        // CREATING STARCOIN ANIMATION
        this.anims.create({
            key: "starcoin_anim",
            frames: this.anims.generateFrameNumbers("starcoin"),
            frameRate: 20,
            repeat: -1
        });

        this.coins = this.physics.add.group();
        var maxObjects = 4;
        for (var i = 0; i <= maxObjects; i++) {
            var starCoin = this.physics.add.sprite(0, 0, "starcoin");
            starCoin.setScale(0.15);
            starCoin.play("starcoin_anim");
            this.coins.add(starCoin);
            starCoin.setRandomPosition(0, 0, game.config.width, game.config.height);
            starCoin.setVelocity(100, 100);
            starCoin.setCollideWorldBounds(true);
            starCoin.setBounce(1);
        }

        // ADD PLAYER
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2 - 50, "player");
        this.player.setOrigin(0.5, 0.5);
        this.player.setScale(0.5);

        // ADD PLAYER MOTION PROPERTIES
        this.player.setDamping(true);
        this.player.setDrag(0.99);
        this.player.setMaxVelocity(200);

        // ADD PLAYER KEYBOARD CONTROLS
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // CREATE PROJECTILE ANIMATION

        this.anims.create({
            key: "projectile_anim",
            frames: this.anims.generateFrameNumbers("projectile"),
            frameRate: 20,
            repeat: -1
        });

        // CREATE PROJECTILE GROUP
        this.projectiles = this.add.group();

        // ADD OVERLAP BETWEEN PLAYER AND COINS
        this.physics.add.overlap(this.player, this.coins, this.pickCoins, null, this);

        // ADD OVERLAP BETWEEN PLAYER AND ROCKS
        this.physics.add.overlap(this.player, this.rocks, this.triggerCollision, null, this);

        // ADD OVERLAP BETWEEN PLAYERS AND ENEMY SHIPS
        this.physics.add.overlap(this.player, this.enemies, this.triggerCollision, null, this);

        // ADD OVERLAP BETWEEN PROJECTILE AND ROCKS
        this.physics.add.collider(this.projectiles, this.rocks, this.triggerProjectileCollision, null, this);

        // ADD OVERLAP BETWEEN PROJECTILE AND ENEMY SHIPS
        this.physics.add.collider(this.projectiles, this.enemies, this.triggerProjectileCollision, null, this);

        // ADDING SCORE LABEL
        this.score = 0;
        this.scoreLabel = this.add.text(10, 7, "Score: " + this.zeroPad(this.score, 6), { font: "15px Arial", fill: "white" });

        // ADDING PLAYER LIVES LABEL
        this.playerLives = 3;
        this.playerLivesLabel = this.add.text(game.config.width - 70, 7, "Lives: " + this.playerLives, { font: "15px Arial", fill: "white" });

        // CREATE EXPLOSION ANIMATION
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: false
        });

        // CREATE SOUND EFFECTS
        this.projectile_explosionSFX = this.sound.add("projectile_explosionSFX");
        this.collision_explosionSFX = this.sound.add("collision_explosionSFX");
        this.projectile_fireSFX = this.sound.add("projectile_fireSFX");
        this.coin_pickupSFX = this.sound.add("coin_pickupSFX");
        this.respawnSFX = this.sound.add("respawnSFX");
        this.deathSFX = this.sound.add("deathSFX");
    }

    zeroPad(number, size) {
        var stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }


    // PLAYER COLLISION: OBJECT CAN BE EITHER ROCKS OR ENEMY SHIPS
    triggerCollision(player, object) {
        if (this.player.alpha < 1) return;
        var explosion = new Explosion(this, player.x, player.y, object);
        this.collision_explosionSFX.play();
        object.y += game.config.height * 2;
        object.x += game.config.width * 2;
        this.resetPosition(object);
        player.disableBody(true, true);
        this.updatePlayerLives();
        if (this.playerLives <= 0) return;
        this.startResetPlayerTimer();
    }

    loadGameOverScreen() {
        this.deathSFX.play();
        this.add.text(game.config.width / 2 - 100, game.config.height / 2, "ALL LIVES LOST!", { font: "30px Arial", fill: "white" });
        setTimeout(() => {
            this.scene.start('endGame');
        }, 3000);
    }

    startResetPlayerTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        })
    }

    resetPlayer() {
        var x = game.config.width / 2;
        var y = game.config.height;
        this.player.enableBody(true, x, y, true, true);
        this.player.alpha = 0.5;
        this.respawnSFX.play();

        var tween = this.tweens.add({
            targets: this.player,
            y: game.config.height / 2 - 50,
            ease: 'Power1',
            duration: 2000,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }

    // PROJECTILE COLLISION: OBJECT CAN BE EITHER ROCKS OR ENEMY SHIPS
    triggerProjectileCollision(projectile, object) {
        projectile.destroy();
        var explosion = new Explosion(this, object.x, object.y, object);
        this.projectile_explosionSFX.play();
        object.y += game.config.height * 2;
        object.x += game.config.width * 2;
        // ADD 10 TO SCORE (TURN INTO VARIABLE)
        this.updateScore(10);
    }

    pickCoins(player, powerUp) {
        if (this.player.active && this.player.alpha == 1) {
            powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);
            this.coin_pickupSFX.play();
            // ADD 20 TO SCORE (TURN INTO VARIABLE)
            this.updateScore(20);
        }
        else return;
    }

    updatePlayerLives() {
        this.playerLives--;
        this.playerLivesLabel.setText("Lives: " + this.playerLives);
        if (this.playerLives <= 0) {
            this.loadGameOverScreen();
        }
    }

    updateScore(score) {
        this.score += score;
        var scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel.setText("Score: " + scoreFormatted);

        if (this.score > this.highScore1) {
            localStorage.setItem('highScore1', this.score, 'playerName', this.playerName);
        }
        else if (this.score > this.highScore2) {
            localStorage.setItem('highScore2', this.score, 'playerName', this.playerName);
        }
        else if (this.score > this.highScore3) {
            localStorage.setItem('highScore3', this.score, 'playerName', this.playerName);
        }
        else if (this.score > this.highScore4) {
            localStorage.setItem('highScore4', this.score, 'playerName', this.playerName);
        }
        else if (this.score > this.highScore5) {
            localStorage.setItem('highScore5', this.score, 'playerName', this.playerName);
        }
    }

    giveRocksSpeed(rock, speed) {

        if (rock == this.rock1_big) {
            rock.y += speed;
            rock.x -= speed;
        }

        else if (rock == this.rock1_medium) {
            rock.y += speed;
            rock.x += speed;
        }

        else if (rock == this.rock1_small) {
            rock.y -= speed;
            rock.x -= speed;
        }

        else if (rock == this.rock2_big) {
            rock.y -= speed;
        }

        else if (rock == this.rock2_medium) {
            rock.y += speed;
            rock.x -= speed;
        }

        else if (rock == this.rock2_small) {
            rock.y -= speed;
            rock.x += speed;
        }

        this.resetPosition(rock);

    }

    // RESET POSITION OF ENEMY SHIPS OR ROCKS, OBJECT CAN BE EITHER ROCKS OR ENEMY SHIPS
    resetPosition(object) {
        if (object.y > game.config.height + 200) {
            object.x = Phaser.Math.Between(0, game.config.width);
            object.y = -200;
        }

        else if (object.x > game.config.width + 200) {
            object.y = Phaser.Math.Between(0, game.config.height);
            object.x = -200;
        }

        else if (object.y < -200) {
            object.x = Phaser.Math.Between(0, game.config.width);
            object.y = game.config.height + 200;
        }

        else if (object.x < -200) {
            object.y = Phaser.Math.Between(0, game.config.height);
            object.x = game.config.width + 200;
        }
    }

    moveEnemyShip(enemyShip, speed) {
        if (enemyShip == this.enemy1) {
            enemyShip.y += speed;
            enemyShip.x += speed;
        }
        if (enemyShip == this.enemy2) {
            enemyShip.y -= speed;
            enemyShip.x += speed;
        }
        if (enemyShip == this.enemy3) {
            enemyShip.y += speed;
            enemyShip.x -= speed;
        }
        this.resetPosition(enemyShip);
    }

    update() {

        // GIVE ROCKS THEIR SPEED
        this.giveRocksSpeed(this.rock1_big, 1);
        this.giveRocksSpeed(this.rock1_medium, 2);
        this.giveRocksSpeed(this.rock1_small, 3);
        this.giveRocksSpeed(this.rock2_big, 1);
        this.giveRocksSpeed(this.rock2_medium, 2);
        this.giveRocksSpeed(this.rock2_small, 3);

        // GIVE ENEMY SHIPS THEIR SPEED
        this.moveEnemyShip(this.enemy1, 2);
        this.moveEnemyShip(this.enemy2, 2);
        this.moveEnemyShip(this.enemy3, 2);


        // SCROLLING BACKGROUND
        this.background.tilePositionY -= 0.5;
        this.background.tilePositionX += 0.5;

        //PLAYER MOVEMENT
        this.movePlayerManager();

        // PROJECTILE DELETION MANAGEMENT
        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
            var projectile = this.projectiles.getChildren()[i];
            projectile.update();
        }
    }

    movePlayerManager() {
        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body.acceleration);
        }
        else {
            this.player.setAcceleration(0);
        }

        if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-300);
        }
        else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(300);
        }
        else {
            this.player.setAngularVelocity(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active && this.player.alpha == 1) this.shootProjectile();
        }

        this.physics.world.wrap(this.player, 10);
    }

    shootProjectile() {
        var projectile = new Projectile(this, this.player.x, this.player.y);
        this.projectile_fireSFX.play();
        // SETTING SCALE HERE INSTEAD OF IN THE CONSTRUCTOR TO AVOID OVERLAP BUG
        projectile.setScale(0.25);
    }
}

