class Selecting extends Phaser.Scene {
    constructor() {
        super('P1SelectingScene')
    }

   

    create() {
        this.cars = []
        this.carindex = 2
        this.carSpacing = 150
        this.centerX = this.game.config.width/2
        this.centerY = this.game.config.height/2

        this.selectingbox = this.add.image(this.centerX, this.centerY, 'selectingbox')
        
        this.carKeys= ['car1', 'car2', 'car3', 'car4', 'car5']

        this.carKeys.forEach((car, index) => {
            let x = this.centerX + (index - this.carindex) * this.carSpacing
            let carSprites = this.add.sprite(x, this.centerY, car).setAlpha(index === this.carindex ? 1 : 0.4)
            this.cars.push(carSprites)
        })

        this.add.bitmapText(this.game.config.width/2, this.game.config.height/4, 'gem_font', 'P1 SELECT YOUR CAR', 32).setOrigin(0.5)
        this.add.bitmapText(this.game.config.width/2, this.game.config.height/1.4, 'gem_font', '<- -> to scroll', 16).setOrigin(0.5)
        this.add.bitmapText(this.game.config.width/2, this.game.config.height/1.3, 'gem_font', 'Press \'ENTER\' to select', 16).setOrigin(0.5)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1))
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1))

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        this.music = this.sound.add('carchoosing', {loop : true})
        this.music.play()

        this.enterKey.on('down', () => {
            let P1selectedCarIndex = this.carKeys[this.carindex]
            this.sound.play('carselected')
            this.music.pause()
            this.scene.start('P2SelectingScene', { P1selectedCarIndex })
        })

    
    }

    moveSelection(direction) {
        let newindex = this.carindex + direction
        this.sound.play('carselecting')

        if (newindex >= 0 && newindex < this.cars.length) {
            this.carindex = newindex

            this.cars.forEach((car, index) => {
                let targetx = this.centerX + (index - this.carindex) * this.carSpacing

                this.tweens.add({
                    targets: car,
                    x: targetx,
                    duration: 300,
                    ease: 'Cubic.easeOut'
                })

                car.setAlpha(index === this.carindex ? 1 : 0.5)
            })
        }
    }
}