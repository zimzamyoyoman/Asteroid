class Rock extends Phaser.GameObjects.Sprite {
    constructor(scene, key) {
        // SET ROCK POSITION
        var x = Phaser.Math.Between(0, game.config.width);
        var y = Phaser.Math.Between(0, game.config.height);

        // SET ROCK SPEED
        var rockSpeed = 2;

        // CALL TO SUPER
        super(scene, x, y, key);

        // ADD ROCK TO GAME SCENE (SCENE 2)
        scene.add.existing(this);
        this.setScale(0.25);

        // ADD ROCK TO GROUP
        scene.rocks.add(this);

        // ENABLE PHYSICS FOR PROJECTILE
        scene.physics.world.enableBody(this);
        this.giveRocksSpeed(this, rockSpeed, key);
        //scene.physics.velocityFromAngle(scene.player.angle, projectileSpeed, this.body.velocity);
    }

    giveRocksSpeed(rock, speed, key) {

        if (key == "rock1_big") {
            console.log("yes");

            rock.y += speed;
            rock.x -= speed;
        }

        else if (key == "rock1_medium") {
            rock.y += speed;
            rock.x += speed;
        }

        else if (key == "rock1_small") {
            rock.y -= speed;
            rock.x -= speed;
        }

        else if (key == "rock2_big") {
            rock.y -= speed;
        }

        else if (key == "rock2_medium") {
            rock.y += speed;
            rock.x -= speed;
        }

        else if (key == "rock2_small") {
            rock.y -= speed;
            rock.x += speed;
        }

        this.resetRockPosition(rock);

    }

    resetRockPosition(rock) {
        if (rock.y > game.config.height + 50) {
            rock.x = Phaser.Math.Between(0, game.config.width);
            rock.y = -50;
        }

        else if (rock.x > game.config.width + 50) {
            rock.y = Phaser.Math.Between(0, game.config.height);
            rock.x = -50;
        }

        else if (rock.y < -50) {
            rock.x = Phaser.Math.Between(0, game.config.width);
            rock.y = game.config.height + 50;
        }

        else if (rock.x < -50) {
            rock.y = Phaser.Math.Between(0, game.config.height);
            rock.x = game.config.width + 50;
        }
    }

    update() {
        //console.log(this.y);
        //console.log(this.x);

        // DESTROY PROJECTILE ON LEAVING WORLD BOUNDARY
        // if (this.y < -10 || this.y > game.config.height + 10 || this.x < -10 || this.x > game.config.width + 10) {
        //     this.destroy();
        // }
    }
}