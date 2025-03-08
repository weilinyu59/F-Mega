class Track extends Phaser.Scene {
    constructor(){
        super('TrackScene')
    }

    init(data) {
        this.P1selectedCarIndex = data.P1selectedCarIndex
        this.P2selectedCarIndex = data.P2selectedCarIndex
    }


    create() {
        
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tracktileset', 'tracktileset')
        
        const BackgroundLayer = map.createLayer('Background', tileset, 0, 0)
        const TrackLayer = map.createLayer('Tracklayer', tileset, 0, 0)

        TrackLayer.setCollisionByProperty({ collides : true })
        BackgroundLayer.setCollisionByProperty({ collides : true })

        const P1Spawn = map.findObject('P1Spawn', (obj) => obj.name === 'P1Spawn')
        const P2Spawn = map.findObject('P1Spawn', (obj) => obj.name === 'P2Spawn')


        this.P1Car = this.physics.add.sprite(P1Spawn.x, P1Spawn.y, this.P1selectedCarIndex, 0)
        this.P2Car = this.physics.add.sprite(P2Spawn.x, P2Spawn.y, this.P2selectedCarIndex, 0)

        this.P1Car.setDamping(true).setDrag(0.98).setMaxVelocity(200)
        this.P2Car.setDamping(true).setDrag(0.98).setMaxVelocity(200)

        this.P1Camera = this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.P2Camera = this.cameras.add(this.game.config.width/2, 0, this.game.config.width/2, this.game.config.height)
        this.P2Camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.P1Camera.setViewport(0, 0, this.game.config.width/2, this.game.config.height)

        this.P1Camera.startFollow(this.P1Car)
        this.P2Camera.startFollow(this.P2Car)

        this.physics.add.collider(this.P1Car, TrackLayer)
        this.physics.add.collider(this.P2Car, TrackLayer)

        this.physics.add.collider(this.P1Car, BackgroundLayer)
        this.physics.add.collider(this.P2Car, BackgroundLayer)


        this.cursors = this.input.keyboard.createCursorKeys()

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)

        this.music = this.sound.add('gamebgm', {loop : true})  // looping the music
        this.music.play()
    }




    update() {
        let car1speed = 0
        if(this.cursors.up.isDown) {
            car1speed = 200
            // this.physics.velocityFromRotation(this.P1Car.rotation, 150, this.P1Car.body.acceleration)
        }else{
            car1speed = -100
            // this.P1Car.setAcceleration(0)
        }

        if(car1speed !== 0) {
            this.physics.velocityFromRotation(this.P1Car.rotation, car1speed, this.P1Car.body.velocity)
        }

        if(this.cursors.left.isDown) {
            this.P1Car.play(`LeftTurn${this.P1selectedCarIndex}`)
            this.P1Car.setAngularVelocity(-100)
        }else if(this.cursors.right.isDown) {
            this.P1Car.play(`RightTurn${this.P1selectedCarIndex}`)
            this.P1Car.setAngularVelocity(100)
        }else{
            this.P1Car.play(`Rest${this.P1selectedCarIndex}`)
            this.P1Car.setAngularVelocity(0)
        }

        let car2speed = 0

        if (this.keyW.isDown) {
            car2speed = 200
            // this.physics.velocityFromRotation(this.P2Car.rotation, 150, this.P2Car.body.acceleration)
        } else {
            car2speed = -100
            // this.P2Car.setAcceleration(0)
        }

        if(car2speed !== 0) {
            this.physics.velocityFromRotation(this.P2Car.rotation, car2speed, this.P2Car.body.velocity)
        }

        if(this.keyA.isDown) {
            this.P2Car.play(`LeftTurn${this.P2selectedCarIndex}`)
            this.P2Car.setAngularVelocity(-100)
        }else if(this.keyD.isDown) {
            this.P2Car.play(`RightTurn${this.P2selectedCarIndex}`)
            this.P2Car.setAngularVelocity(100)
        }else{
            this.P2Car.play(`Rest${this.P2selectedCarIndex}`)
            this.P2Car.setAngularVelocity(0)
        }
    }
}