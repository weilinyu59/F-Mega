class Track extends Phaser.Scene {
    constructor(){
        super('TrackScene')
    }

    // Initialize the selected cars from the previous scene
    init(data) {
        this.P1selectedCarIndex = data.P1selectedCarIndex
        this.P2selectedCarIndex = data.P2selectedCarIndex
    }


    create() {

        // Set up the game state
        this.P1Laps = 0
        this.P2Laps = 0
        this.MaxLaps = 3
        this.gameOver = false
        
        // Load the tilemap and tileset and create the layers
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tracktileset', 'tracktileset')
        
        const BackgroundLayer = map.createLayer('Background', tileset, 0, 0)
        const TrackLayer = map.createLayer('Tracklayer', tileset, 0, 0)

        TrackLayer.setCollisionByProperty({ collides : true })
        BackgroundLayer.setCollisionByProperty({ collides : true })

        const P1Spawn = map.findObject('P1Spawn', (obj) => obj.name === 'P1Spawn')
        const P2Spawn = map.findObject('P1Spawn', (obj) => obj.name === 'P2Spawn')

        // Set up the cars speed and position
        this.P1CarSpeed = 0;
        this.P2CarSpeed = 0;

        this.P1Car = this.physics.add.sprite(P1Spawn.x, P1Spawn.y, this.P1selectedCarIndex, 0)
        this.P2Car = this.physics.add.sprite(P2Spawn.x, P2Spawn.y, this.P2selectedCarIndex, 0)

        // Set up physics bodies properly
        this.P1Car.setDamping(true).setDrag(0.98).setMaxVelocity(250)
        this.P2Car.setDamping(true).setDrag(0.98).setMaxVelocity(250)
        
        // Enable rotation of body with sprite
        this.P1Car.body.setAllowRotation(true)
        this.P2Car.body.setAllowRotation(true)
        
        // Set the size of the car body (adjust these values based on your car sprite dimensions)
        this.P1Car.body.setSize(this.P1Car.width * 0.8, this.P1Car.height * 0.8)
        this.P2Car.body.setSize(this.P2Car.width * 0.8, this.P2Car.height * 0.8)

        // Set up the cameras
        this.P1Camera = this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.P2Camera = this.cameras.add(this.game.config.width/2, 0, this.game.config.width/2, this.game.config.height)
        this.P2Camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.P1Camera.setViewport(0, 0, this.game.config.width/2, this.game.config.height)

        this.P1Camera.startFollow(this.P1Car)
        this.P2Camera.startFollow(this.P2Car)

        // Set up the checkpoint zones and lap text
        this.P1checkpointZone = this.add.zone(P1Spawn.x, P1Spawn.y, 100, 50).setOrigin(0.5)
        this.physics.world.enable(this.P1checkpointZone)
        this.P1checkpointZone.body.setAllowGravity(false)
        this.P1checkpointZone.body.immovable = true

        this.P2checkpointZone = this.add.zone(P2Spawn.x, P2Spawn.y, 100, 50).setOrigin(0.5)
        this.physics.world.enable(this.P2checkpointZone)
        this.P2checkpointZone.body.setAllowGravity(false)
        this.P2checkpointZone.body.immovable = true

        // Set up the lap text for each player
        this.P1LapText = this.add.text(10, 80, 'P1 Laps: 0/3', {
            font: '16px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setScrollFactor(0)
        this.P1LapText.cameraFilter = ~this.P1Camera.id

        this.P2LapText = this.add.text(this.game.config.width/4 - 70, 80, 'P2 Laps: 0/3', {
            font: '16px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setScrollFactor(0)
        this.P2LapText.cameraFilter = ~this.P2Camera.id

        this.P1LeftCheckpoint = true
        this.P2LeftCheckpoint = true

        // Set up the overlap checks for the checkpoint zones
        this.physics.add.overlap(this.P1Car, this.P1checkpointZone, this.handleP1Checkpoint, null, this)
        this.physics.add.overlap(this.P2Car, this.P2checkpointZone, this.handleP2Checkpoint, null, this)

        this.P1Dashboard = this.add.container(10, this.game.config.height - 60);
        this.P1DashboardBg = this.add.rectangle(0, 0, 140, 50, 0x000000, 0.7).setOrigin(0, 0);
        this.P1SpeedLabel = this.add.text(10, 10, 'P1 SPEED:', { 
            font: '16px Arial', 
            fill: '#ffffff' 
        });
        this.P1SpeedText = this.add.text(10, 30, '0 mph', { 
            font: '18px Arial', 
            fill: '#ff0000',
            fontStyle: 'bold'
        });
        this.P1Dashboard.add([this.P1DashboardBg, this.P1SpeedLabel, this.P1SpeedText]);
        this.P1Dashboard.setScrollFactor(0); // Fix to camera
        
        // P2 Dashboard (bottom right)
        this.P2Dashboard = this.add.container(this.game.config.width/4 - 70, this.game.config.height - 60);
        this.P2DashboardBg = this.add.rectangle(0, 0, 140, 50, 0x000000, 0.7).setOrigin(0, 0);
        this.P2SpeedLabel = this.add.text(10, 10, 'P2 SPEED:', { 
            font: '16px Arial', 
            fill: '#ffffff' 
        });
        this.P2SpeedText = this.add.text(10, 30, '0 mph', { 
            font: '18px Arial', 
            fill: '#00ff00',
            fontStyle: 'bold'
        });
        this.P2Dashboard.add([this.P2DashboardBg, this.P2SpeedLabel, this.P2SpeedText]);
        this.P2Dashboard.setScrollFactor(0); // Fix to camera
        
        // Set dashboard visibility to respective cameras
        this.P1Dashboard.cameraFilter = ~this.P1Camera.id;
        this.P2Dashboard.cameraFilter = ~this.P2Camera.id;

        this.physics.add.collider(this.P1Car, TrackLayer)
        this.physics.add.collider(this.P2Car, TrackLayer)

        this.physics.add.collider(this.P1Car, BackgroundLayer)
        this.physics.add.collider(this.P2Car, BackgroundLayer)    
        this.physics.add.collider(this.P1Car, this.P2Car)


        this.cursors = this.input.keyboard.createCursorKeys()

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)

        this.music = this.sound.add('gamebgm', {loop : true})  // looping the music
        this.music.play()
    }




    update() {

        // Check if cars have left their checkpoint zones
        if (!this.P1LeftCheckpoint) {
            if (!this.physics.overlap(this.P1Car, this.P1checkpointZone)) {
                this.P1LeftCheckpoint = true;
            }
        }
        
        if (!this.P2LeftCheckpoint) {
            if (!this.physics.overlap(this.P2Car, this.P2checkpointZone)) {
                this.P2LeftCheckpoint = true;
            }
        }
        
        // Skip rest of update if game is over
        if (this.gameOver) return;

        const p1SpeedDisplay = Math.abs(Math.round(this.P1CarSpeed));
        const p2SpeedDisplay = Math.abs(Math.round(this.P2CarSpeed));
    
        this.P1SpeedText.setText(`${p1SpeedDisplay} mph`);
        this.P2SpeedText.setText(`${p2SpeedDisplay} mph`);
    
    // Add color effects based on speed
        if (p1SpeedDisplay > 200) {
            this.P1SpeedText.setColor('#ff0000'); // Red at high speed
        } else if (p1SpeedDisplay > 100) {
            this.P1SpeedText.setColor('#ffff00'); // Yellow at medium speed
        } else {
            this.P1SpeedText.setColor('#ffffff'); // White at low speed
        }
    
        if (p2SpeedDisplay > 200) {
            this.P2SpeedText.setColor('#ff0000'); // Red at high speed
        } else if (p2SpeedDisplay > 100) {
            this.P2SpeedText.setColor('#ffff00'); // Yellow at medium speed
        } else {
            this.P2SpeedText.setColor('#ffffff'); // White at low speed
        }
        
        // Update the car speed and rotation based on input for P1
        if(this.cursors.up.isDown) {
            this.P1CarSpeed = -300
        } else if (this.cursors.down.isDown) {
            this.P1CarSpeed = -150
        } else {
            this.P1CarSpeed *= 0.99    
        }

        if(this.P1CarSpeed !== 0) {
            this.physics.velocityFromRotation(-this.P1Car.rotation, this.P1CarSpeed, this.P1Car.body.velocity)
            let tempX = this.P1Car.body.velocity.x
            this.P1Car.body.velocity.x = this.P1Car.body.velocity.y
            this.P1Car.body.velocity.y = tempX
        } else {
            this.P1Car.setVelocity(0)
        }
 
        // Add car rotation based on input for P1
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

        // Update the car speed and rotation based on input for P2
        if (this.keyW.isDown) {
            this.P2CarSpeed = -300
        } else if (this.keyS.isDown) {
            this.P2CarSpeed = 150
        } else {
            this.P2CarSpeed *= 0.99
        }

        if(this.P2CarSpeed !== 0) {
            this.physics.velocityFromRotation(-this.P2Car.rotation, this.P2CarSpeed, this.P2Car.body.velocity)
            let tempX = this.P2Car.body.velocity.x
            this.P2Car.body.velocity.x = this.P2Car.body.velocity.y
            this.P2Car.body.velocity.y = tempX
        } else {
            this.P2Car.setVelocity(0)
        }

        // Add car rotation based on input for P2
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

    // Handle the checkpoint logic for each player
    handleP1Checkpoint() {
        if(this.P1LeftCheckpoint && !this.gameOver) {
            this.P1Laps++
            this.P1LapText.setText(`P1 Laps: ${this.P1Laps}/3`)
            this.P1LeftCheckpoint = false

            if(this.P1Laps >= this.MaxLaps) {
                this.showWinner('PLAYER 1')
            }
        }
    }

    // Handle the checkpoint logic for each player
    handleP2Checkpoint() {
        if(this.P2LeftCheckpoint && !this.gameOver) {
            this.P2Laps++
            this.P2LapText.setText(`P2 Laps: ${this.P2Laps}/3`)
            this.P2LeftCheckpoint = false

            if(this.P2Laps >= this.MaxLaps) {
                this.showWinner('PLAYER 2')
            }
        }
    }

    // Display winner and handle game over state
    showWinner(winner) {
        this.gameOver = true;
        
        // Stop the music when game is over
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
        
        // Create a new camera that ignores the split-screen setup
        const winCamera = this.cameras.add(0, 0, this.game.config.width, this.game.config.height);
        winCamera.setScroll(0, 0);
        
        // Create semi-transparent overlay covering the full game screen
        const overlay = this.add.rectangle(
            0, 0, 
            this.game.config.width, this.game.config.height, 
            0x000000, 0.7
        ).setOrigin(0).setDepth(100);
        
        // Display winner text centered on the full screen
        const winText = this.add.text(
            this.game.config.width/2, 
            this.game.config.height/2 - 50, 
            `${winner} WINS!`, {
                font: '32px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setDepth(101);
        
        // Add replay button centered on the full screen
        const replayButton = this.add.text(
            this.game.config.width/2, 
            this.game.config.height/2 + 50,
            'PLAY AGAIN', {
                font: '24px Arial',
                fill: '#ffffff',
                backgroundColor: '#ff0000',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setDepth(101)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => replayButton.setStyle({ fill: '#ff0000', backgroundColor: '#ffffff' }))
        .on('pointerout', () => replayButton.setStyle({ fill: '#ffffff', backgroundColor: '#ff0000' }))
        .on('pointerdown', () => this.scene.start('startingScene'));
        
        // Make gameplay cameras ignore these UI elements
        this.P1Camera.ignore([overlay, winText, replayButton]);
        this.P2Camera.ignore([overlay, winText, replayButton]);
        
        // These elements should only be visible in the win camera
        winCamera.ignore(this.children.list.filter(child => 
            child !== overlay && 
            child !== winText && 
            child !== replayButton
        ));
    }
}