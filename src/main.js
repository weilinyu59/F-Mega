//Name: Weilin Yu
//Date: 3/18/2025
//Citation: All artworks are from Weilin Yu. All sound effects and bgms are from https://pixabay.com/music/search/genre/video%20games/
//Phaser's major components: Physics system, Camera, text objects, the animation manager, the tween manager, timers, tilemaps
//Time spent: 40-45 hours



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