
let config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    render: {
        pixelArt: true
    },
    width: 600,
    height: 500,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    // zoom: 2,
    scene: [ Starting, Selecting, Selecting2, Track, ]
}

const game = new Phaser.Game(config)

let {width, height} = game.config