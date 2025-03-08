class Starting extends Phaser.Scene {
    constructor() {
        super('startingScene')
    }
    
    preload() {
        this.load.path = './assets/'
        this.load.image('gamecover', 'cover.png')

        for(let i = 1; i <= 5; i++) {
            this.load.spritesheet(`car${i}`, `car-${i}.png`, {
                frameWidth: 32,
                frameHeight: 50,
            })
        }

        this.load.image('selectingbox', 'selectingbox.png')
        
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml')

        this.load.image('tracktileset', 'tracktileset.png')

        this.load.tilemapTiledJSON('tilemapJSON', 'Track.json')

        this.load.audio('carchoosing', 'Carchoosing.mp3')
        this.load.audio('carchoosing2', 'Carchoosing2.mp3')
        this.load.audio('carselected', 'carselected.mp3')
        this.load.audio('carselecting', 'carselecting.mp3')
        this.load.audio('enter', 'enter.mp3')
        this.load.audio('gamebgm', 'gamebgm.mp3')
        this.load.audio('gamecover', 'gamecover.mp3')
    }

    create() {
        this.cover = this.add.image(0, 0, 'gamecover').setOrigin(0)
        this.add.bitmapText(this.game.config.width/2, this.game.config.height/1.2, 'gem_font', 'Press \'Enter\' to start', 16).setOrigin(0.5)
        
        this.cursors = this.input.keyboard.createCursorKeys()
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        for (let i = 1; i <= 5; i++) {
            this.anims.create({
                key: `LeftTurncar${i}`,
                frameRate: 2,
                repeat: 0,
                frames: this.anims.generateFrameNames(`car${i}`, {start: 1, end: 1} )
            })

            this.anims.create({
                key: `RightTurncar${i}`,
                frameRate: 2,
                repeat: 0,
                frames: this.anims.generateFrameNames(`car${i}`, {start: 2, end: 2} )
            })

            this.anims.create({
                key: `Restcar${i}`,
                frameRate: 2,
                repeat: 0,
                frames: this.anims.generateFrameNames(`car${i}`, {start: 0, end: 0} )
            })
        }

        this.music = this.sound.add('gamecover', {loop : true})
        this.music.play()
        
    }

    update() {
        if(this.enterKey.isDown) {
            this.sound.play('enter')
            this.fadeaway()
            this.music.pause()
        }
    }

    fadeaway() {
        this.tweens.add({
            targets: this.cover,
            alpha: 0,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                this.scene.start('P1SelectingScene')
            }
        })
    }
}