class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, object) {
        super(scene, x, y, "explosion");
        scene.add.existing(this);
        //this.setScale(object.scale);
        this.play("explode");
        scene.time.addEvent({
            delay: 700,
            callback: this.deleteExplosion,
            callbackScope: this,
            loop: false
        });
    }

    deleteExplosion() {
        this.destroy();
    }
    
}