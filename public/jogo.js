

class jogo extends Phaser.Scene {
    
    constructor() {
        super("jogo");
    }
    

    preload(){
        game.scene.pause()

        this.load.image('tela','img/tela.jpg');
        this.load.spritesheet('personagem','img/dude.png',{
            frameWidth:32, frameHeight:42
        });
        this.load.spritesheet('caixa','img/caixa.png',{
            frameWidth:52, frameHeight:52
        });
        this.load.image('bloco','img/bloco.png');
        
        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');
    


    }

    create(){

        var self = this;
        this.socket = io();
        this.outrosPlayers = this.physics.add.group();
        this.players = this.physics.add.group();

        this.add.image(390,338,'tela');
        //adicionando os grupos
        this.blocos = this.physics.add.staticGroup();
        this.caixas = this.physics.add.staticGroup();

        let config = this.cache.json.get('gamma_json');
        this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

        //escutando os players
        this.socket.on('passandoPlayers', players => {
            Object.keys(players).forEach(function (id) {
              if (players[id].playerId === self.socket.id) {
                self.addPlayer(self,players[id]);
              } else {
                self.addOutrosPlayers(self, players[id]);
              }
            });
        });
        
        this.socket.on('novoPlayer', function (playerInfo) {
            self.addOutrosPlayers(self, playerInfo);
        });

        this.socket.on('playerMovimentou', function (playerInfo) {
            self.outrosPlayers.getChildren().forEach(outroPlayer => {
              if (playerInfo.playerId === outroPlayer.playerId) {
                outroPlayer.setPosition(playerInfo.x, playerInfo.y);
              }
            });
        });

        this.socket.on('desconectado', function (playerId) {
            self.outrosPlayers.getChildren().forEach(outroPlayer => {
              if (playerId === outroPlayer.playerId) {
                outroPlayer.destroy();
              }
            });
          });

        this.socket.on('mapa', function (mapa) {
            self.criandoMapa(self,mapa);
        });


        //adicionando os controles
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.barra =  this.input.keyboard.addKey(32);

        this.physics.add.collider(this.players, this.blocos);
        this.physics.add.collider( this.players, this.caixas);

        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers('personagem',{start: 0, end: 3}),
            frameRate: 10,
            repeate: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'personagem', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers('personagem',{start: 5, end: 8}),
            frameRate:10,
            repeate:-1
        });
    }

    update(){
        if(this.player){
            if (this.cursor.left.isDown) {
                this.player.setVelocityX(-150);
            } else if (this.cursor.right.isDown) {
                this.player.setVelocityX(150);
            } else{
                this.player.setVelocityX(0);
            }
            if (this.cursor.up.isDown) {
                this.player.setVelocityY(-150);
            } else if (this.cursor.down.isDown) {
                this.player.setVelocityY(150);
            } else{
                this.player.setVelocityY(0);
            }
            // emit player movement
            var x = this.player.x;
            var y = this.player.y;
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
                this.socket.emit('playerMovimentando', { x: this.player.x, y: this.player.y});
            }

            // save old position data
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
            };
        }    
    }

    addPlayer = (self,playerInfo) =>{
        self.player = self.players.create(playerInfo.x,playerInfo.y,'personagem');
    }

    addOutrosPlayers = (self, playerInfo)=> {
        const outroPlayer = self.add.sprite(playerInfo.x,playerInfo.y,'personagem');
        outroPlayer.setTint(0xff0000);
        outroPlayer.playerId = playerInfo.playerId;
        self.outrosPlayers.add(outroPlayer);
    }

    criandoMapa(self,mapa){
        for(var i=0;i<13;i++){
            for(var j=0;j<19;j++){
              if(mapa[i][j]==1){
                self.blocos.create(j*52+26,i*52+26,'bloco');
              }else if(mapa[i][j]==3 || mapa[i][j]==-2 || mapa[i][j]==-3 || mapa[i][j]==-4){
                self.caixas.create(j*52+26,i*52+26,'caixa');
              }
            }
          }
    }
}
