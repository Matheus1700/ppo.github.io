

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

        //adicionando os controles
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.barra =  this.input.keyboard.addKey(32);
        

        this.physics.add.collider(this.outrosPlayers, this.blocos);
        this.physics.add.collider( this.outrosPlayers, this.caixas);

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

    }

    addPlayer = (self,playerInfo) =>{
        self.player = self.add.sprite(playerInfo.x,playerInfo.y,'personagem');
    }

    addOutrosPlayers = (self,playerInfo)=> {
        const outroPlayer = self.add.sprite(playerInfo.x,playerInfo.y,'personagem');
        outroPlayer.setTint(0xff0000);
        outroPlayer.playerId = playerInfo.playerId;
        self.outrosPlayers.add(outroPlayer);
    }
}
