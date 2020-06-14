class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        // SET PROJECTILE POSITION
        // var x = scene.player.x;
        // var y = scene.player.y;

        // SET PROJECTILE SPEED
        var projectileSpeed = 400;

        // CALL TO SUPER
        super(scene, x, y, "projectile");

        // ADD PROJECTILE TO GAME SCENE (SCENE 2)
        scene.add.existing(this);
        this.setOrigin(0.5, 0.5);

        // IF SCALE IS SET HERE, IT LEADS TO A WEIRD BUG IN WHICH PROJECTILE OVERLAPS WITH OBJECTS MUCH EARLIER THAN ACTUAL OVERLAP
        // this.setScale(0.25);

        // PLAY PROJECTILE ANIMATION
        this.play("projectile_anim");
        
        // ADD PROJECTILE TO GROUP
        scene.projectiles.add(this);

        // ENABLE PHYSICS FOR PROJECTILE
        scene.physics.world.enableBody(this);
        scene.physics.velocityFromAngle(scene.player.angle, projectileSpeed, this.body.velocity);
    }

    update() {
        //console.log(this.y);
        //console.log(this.x);

        // DESTROY PROJECTILE ON LEAVING WORLD BOUNDARY
        if (this.y < -10 || this.y > game.config.height + 10 || this.x < -10 || this.x > game.config.width + 10) {
            this.destroy();
        }
    }
}