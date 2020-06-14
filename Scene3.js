class Scene3 extends Phaser.Scene {
    constructor() {
        super("endGame");
    }

    create() {
        this.add.text(game.config.width / 2, game.config.height / 2, "Game Over!", { font: "30px Arial", fill: "white" }).setOrigin(0.5);
        
        // PLAY AGAIN GAME BUTTON
        var playAgainText = this.add.text(game.config.width / 2, game.config.height / 2 + 40, "PLAY AGAIN");
        playAgainText.setInteractive();
        playAgainText.setOrigin(0.5);
        playAgainText.on('pointerdown', this.loadGame, this);
        // MAIN MENU BUTTON
        var mainMenuText = this.add.text(game.config.width / 2, game.config.height / 2 + 80, "MAIN MENU");
        mainMenuText.setOrigin(0.5);
        mainMenuText.setInteractive();
        mainMenuText.on('pointerdown', this.loadMainMenu, this);
    }

    // LOAD THE GAME
    loadGame() {
        this.add.text(game.config.width / 2, game.config.height - 100, "Loading...").setOrigin(0.5);
        setTimeout(() => {
            this.scene.start('playGame');
        }, 1000);
    }

    // LOAD MAIN MENU
    loadMainMenu() {
        this.add.text(game.config.width / 2, game.config.height - 100, "Loading...").setOrigin(0.5);
        setTimeout(() => {
            this.scene.start('bootGame');
        }, 1000);
    }

}