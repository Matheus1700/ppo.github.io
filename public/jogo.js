

class jogo extends Phaser.Scene {
    
    constructor() {
        super("jogo");
    }
    init(data){
        this.socket=data.socket;
        this.sala=data.sala;
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
        this.load.spritesheet('bomba','img/bomba.png',{
            frameWidth:30, frameHeight:41
        });
        this.load.image('bloco','img/bloco.png');

        this.load.spritesheet('explosao','img/explosao.png',{
            frameWidth:52, frameHeight:52
        });
        this.load.image('powerUpExplosao','img/PUExplosao.png');
        this.load.image('powerUpVelocidade','img/PUVelocidade.png');
        this.load.image('powerUpBomba','img/PUBomba.png');
        this.load.image('display','img/displayPontos.png');
        this.load.image('win', 'img/telaVoltar.png');
        this.load.image('lose', 'img/telaVoltarLose.png')
       
        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');
    }

    create(){
        this.socket.emit("entrou");
        var self = this;
        this.outrosPlayers = this.physics.add.group();
        this.players = this.physics.add.group();
        this.vivo=true;
        this.display;
        this.pontuacao = 0;
        this.texto;
        this.kills=0;

        this.add.image(390,338,'tela');
        //adicionando os grupos
        this.blocos = this.physics.add.staticGroup();
        this.caixas = this.physics.add.staticGroup();
        this.bombas = this.physics.add.staticGroup();
        this.explosoes = this.physics.add.staticGroup();
        this.explosoes.id;
        this.powerUps = this.physics.add.staticGroup();

        let config = this.cache.json.get('gamma_json');
        this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

        //escutando os players
        this.socket.on('passandoPlayers', players => {
            console.log("passando os players")
            Object.keys(players).forEach(function (id) {
            console.log(players[id])
              if (players[id].playerId === self.socket.id) {
                self.addPlayer(self,players[id]);
                console.log("erro nao encontrado")
              } else {
                self.addOutrosPlayers(self, players[id]);
              }
            });
        });
        
        this.socket.on('novoPlayer', function (playerInfo) {
            self.addOutrosPlayers(self, playerInfo);
        });

        this.socket.on('Kill',  () => {
            this.kills+=1;
            this.pontuacao+=300;
            this.texto.setText((this.pontuacao+"").toUpperCase());
            this.texto.setOrigin(0.5);
        });

        this.socket.on('playerMovimentou', function (playerInfo) {
            self.outrosPlayers.getChildren().forEach(outroPlayer => {
              if (playerInfo.playerId === outroPlayer.playerId) {
                outroPlayer.setPosition(playerInfo.x, playerInfo.y)
                outroPlayer.anims.play(playerInfo.direcao,true);
              }
            });
        });

        this.socket.on('criarBomba', function (playerInfo) {
            self.mapa[(playerInfo.y-26)/52][(playerInfo.x-26)/52]=4;
            var bomba=self.bombas.create(playerInfo.x,playerInfo.y,'bomba').play('bombinha');
            setTimeout(() => {
                bomba.play('bombinha');
            },1000);
            setTimeout(() => {
                self.mapa[(playerInfo.y-26)/52][(playerInfo.x-26)/52]=0;
                if(playerInfo.Id==self.socket.id){
                    self.socket.emit('destruidoBomba');
                    self.hitBomb(bomba,self,playerInfo,true);
                }else{
                    self.hitBomb(bomba,self,playerInfo,false);
                }
                
            },2000);
        });

        this.socket.on('desconectado', function (playerId) {
            self.outrosPlayers.getChildren().forEach(outroPlayer => {
              if (playerId === outroPlayer.playerId) {
                outroPlayer.destroy();
              }
            });
          });

        this.socket.on('mapa', function (ma) {
            self.criandoMapa(self,ma);
            self.mapa=ma;
            self.adicionarScore(self);
        });

        this.socket.on('Game Over',()=>{
            let botaoFim = this.add.image(460, 338, "win").
            setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal",{socket:this.socket})});;
            botaoFim.setOrigin(0.5);
            botaoFim.setScale(1.5);
            this.socket.emit('Acabou',{pontuacao: this.pontuacao, kills: this.kills});
        })
        
        //adicionando os controles
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.barra =  this.input.keyboard.addKey(32);
        this.cursor.barra.estado = true;
        
        this.physics.add.collider(this.players, this.blocos);
        this.physics.add.collider( this.players, this.caixas);
        this.physics.add.collider( this.players, this.bombas);
        this.physics.add.overlap( this.caixas,  this.explosoes, this.ativarDestruicao, null, this);
        this.physics.add.overlap( this.powerUps,  this.players, this.pegarPowerUp, null, this);
        this.physics.add.overlap( this.powerUps,  this.outrosPlayers, this.destruirPowerUp, null, this);
        this.physics.add.overlap( this.powerUps,  this.explosoes, this.destruirPowerUp, null, this);
        this.physics.add.overlap( this.players,  this.explosoes, this.destruirPlayer, null, this);
        this.physics.add.overlap( this.outrosPlayers,  this.explosoes, this.destruirPlayers, null, this);
        

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
        this.anims.create({
            key: "bombinha",
            frames: this.anims.generateFrameNumbers('bomba',{start: 0, end: 4}),
            frameRate: 5,
            repeate: -1
        });
        this.anims.create({
            key: "destruicao",
            frames: this.anims.generateFrameNumbers('caixa',{start: 1, end: 6}),
            frameRate: 5,
            repeate: -1
        });
        self.criandoAnimacaoExplosao(self);
        
    }

    update(){
        if(this.player && this.vivo){
            if (this.cursor.left.isDown) {
                this.player.setVelocityX(-this.player.velocidade);
                this.player.direcao ='left';
                this.player.anims.play('left',true);
            } else if (this.cursor.right.isDown) {
                this.player.setVelocityX(this.player.velocidade);
                this.player.direcao ='right';
                this.player.anims.play('right',true);
            } else{
                this.player.setVelocityX(0);
                this.player.direcao ='turn';
                this.player.anims.play('turn');
            }
            if (this.cursor.up.isDown) {
                this.player.setVelocityY(-this.player.velocidade);
            } else if (this.cursor.down.isDown) {
                this.player.setVelocityY(this.player.velocidade);
            } else{
                this.player.setVelocityY(0);
            }
            if(this.cursor.barra.isDown && this.cursor.barra.estado){
                this.cursor.barra.estado = false;
                var pY=Math.round((this.player.y/52)-0.5);
                var pX=Math.round((this.player.x/52)-0.5);
                if(this.mapa[pY][pX]!=4){
                    this.socket.emit('verificarBomba',{x: pX*52+26, y: pY*52+26, Id: this.socket.id});
                }
            }else if(this.cursor.barra.isUp && !this.cursor.barra.estado){
                this.cursor.barra.estado = true;
            }

            // emit player movement
            var x = this.player.x;
            var y = this.player.y;
            var d = this.player.direcao; 
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || d!=this.player.oldPosition.direcao || d!='turn')) {
                this.socket.emit('playerMovimentando', { x: this.player.x, y: this.player.y, direcao: this.player.direcao, sala:this.sala});
            }

            // save old position data
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
                direcao: this.player.direcao
            };
        }    
    }

    addPlayer (self,playerInfo){
        self.player = self.players.create(playerInfo.x,playerInfo.y,'personagem');
        self.player.velocidade=150;
    }

    addOutrosPlayers(   self, playerInfo){
        const outroPlayer = self.add.sprite(playerInfo.x,playerInfo.y,'personagem');
        outroPlayer.setTint(0xff0000);
        outroPlayer.playerId = playerInfo.playerId;
        outroPlayer.anims.play('turn',true);
        self.outrosPlayers.add(outroPlayer);
    }

    adicionarScore(self){
        self.display = self.add.image(1000,10,'display');
        self.display.setScale(0.8);
        console.log(self.pontuacao)
        self.texto = self.add.bitmapText(950, 25, "gamma", (self.pontuacao+"").toUpperCase());
        self.texto.setOrigin(0.5);
        self.texto.setScale(1.5);
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
    
    criandoAnimacaoExplosao(self){

        self.anims.create({key: 'centroP',frames: [{key: 'explosao', frame: 0}],frameRate: 20});
        self.anims.create({key: 'meioCimaP',frames: [{key: 'explosao', frame: 1}],frameRate: 20});
        self.anims.create({key: 'meioLadoP',frames: [{key: 'explosao', frame: 2}],frameRate: 20});
        self.anims.create({key: 'cimaP',frames: [{key: 'explosao', frame:  3}],frameRate: 20});
        self.anims.create({key: 'baixoP',frames: [{key: 'explosao', frame: 4}],frameRate: 20});
        self.anims.create({key: 'direitaP',frames: [{key: 'explosao', frame: 5}],frameRate: 20});
        self.anims.create({key: 'esquerdaP',frames: [{key: 'explosao', frame: 6}],frameRate: 20});

        self.anims.create({key: 'centroM',frames: [{key: 'explosao', frame: 7}],frameRate: 20});
        self.anims.create({key: 'meioCimaM',frames: [{key: 'explosao', frame: 8}],frameRate: 20});
        self.anims.create({key: 'meioLadoM',frames: [{key: 'explosao', frame: 9}],frameRate: 20});
        self.anims.create({key: 'cimaM',frames: [{key: 'explosao', frame:  10}],frameRate: 20});
        self.anims.create({key: 'baixoM',frames: [{key: 'explosao', frame: 11}],frameRate: 20});
        self.anims.create({key: 'direitaM',frames: [{key: 'explosao', frame: 12}],frameRate: 20});
        self.anims.create({key: 'esquerdaM',frames: [{key: 'explosao', frame: 13}],frameRate: 20});

        self.anims.create({key: 'centroG',frames: [{key: 'explosao', frame: 14}],frameRate: 20});
        self.anims.create({key: 'meioCimaG',frames: [{key: 'explosao', frame: 15}],frameRate: 20});
        self.anims.create({key: 'meioLadoG',frames: [{key: 'explosao', frame: 16}],frameRate: 20});
        self.anims.create({key: 'cimaG',frames: [{key: 'explosao', frame:  17}],frameRate: 20});
        self.anims.create({key: 'baixoG',frames: [{key: 'explosao', frame: 18}],frameRate: 20});
        self.anims.create({key: 'direitaG',frames: [{key: 'explosao', frame: 19}],frameRate: 20});
        self.anims.create({key: 'esquerdaG',frames: [{key: 'explosao', frame: 20}],frameRate: 20});

        self.anims.create({key: 'centroGG',frames: [{key: 'explosao', frame: 21}],frameRate: 20});
        self.anims.create({key: 'meioCimaGG',frames: [{key: 'explosao', frame: 22}],frameRate: 20});
        self.anims.create({key: 'meioLadoGG',frames: [{key: 'explosao', frame: 23}],frameRate: 20});
        self.anims.create({key: 'cimaGG',frames: [{key: 'explosao', frame:  24}],frameRate: 20});
        self.anims.create({key: 'baixoGG',frames: [{key: 'explosao', frame: 25}],frameRate: 20});
        self.anims.create({key: 'direitaGG',frames: [{key: 'explosao', frame: 26}],frameRate: 20});
        self.anims.create({key: 'esquerdaGG',frames: [{key: 'explosao', frame: 27}],frameRate: 20});
    }

    hitBomb(bomba,self,playerInfo,jogadorAtual){
        var x = bomba.x;
        var y = bomba.y; 
        var potencia = playerInfo.potencia;
        var animacao;
        bomba.destroy();
        if(potencia<=2){
            animacao='P';
        }else if(potencia<=4){
            animacao='M';
        }else if(potencia<=6){
            animacao='G';
        }else{
            animacao='GG';
        }

        

        var TodasExplosoes=new Array();
        TodasExplosoes.push(self.explosoes.create(x,y,'explosao').play('centro'+animacao));
        for(var i=0,es=true,di=true,ci=true,ba=true,x1=x,x2=x,y1=y,y2=y;i<potencia;i++){
            x1-=52;
            x2+=52;
            y1-=52;
            y2+=52;
            if(i==potencia-1){  
                if(es && self.mapa[(y-26)/52][(x1-26)/52]!=1){
                    if((self.mapa[(y-26)/52][(x1-26)/52]==3 || self.mapa[(y-26)/52][(x1-26)/52]==-2 || self.mapa[(y-26)/52][(x1-26)/52]==-3 || self.mapa[(y-26)/52][(x1-26)/52]==-4) && jogadorAtual){
                        self.pontuacao+=10;
                    }
                    TodasExplosoes.push(self.explosoes.create(x1,y,'explosao').play('esquerda'+animacao));
                }
                if(di && self.mapa[(y-26)/52][(x2-26)/52]!=1){
                    if((self.mapa[(y-26)/52][(x2-26)/52]==3 || self.mapa[(y-26)/52][(x2-26)/52]==-2 || self.mapa[(y-26)/52][(x2-26)/52]==-3 || self.mapa[(y-26)/52][(x2-26)/52]==-4) && jogadorAtual){
                        self.pontuacao+=10;
                    }
                    TodasExplosoes.push(self.explosoes.create(x2,y,'explosao').play('direita'+animacao)); 
                }
                if(ci && self.mapa[(y1-26)/52][(x-26)/52]!=1){
                    if((self.mapa[(y1-26)/52][(x-26)/52]==3 || self.mapa[(y1-26)/52][(x-26)/52]==-2 || self.mapa[(y1-26)/52][(x-26)/52]==-3 || self.mapa[(y1-26)/52][(x-26)/52]==-4) && jogadorAtual){
                        self.pontuacao+=10;
                    }
                    TodasExplosoes.push(self.explosoes.create(x,y1,'explosao').play('cima'+animacao)); 
                }
                if(ba && self.mapa[(y2-26)/52][(x-26)/52]!=1){
                    if((self.mapa[(y2-26)/52][(x-26)/52]==3 || self.mapa[(y2-26)/52][(x-26)/52]==-2 || self.mapa[(y2-26)/52][(x-26)/52]==-3 || self.mapa[(y2-26)/52][(x-26)/52]==-4) && jogadorAtual){
                        self.pontuacao+=10;
                    }
                    TodasExplosoes.push(self.explosoes.create(x,y2,'explosao').play('baixo'+animacao)); 
                }          
            }else{
                var auxX=(x1-26)/52,auxY=(y-26)/52;
                if(es && self.mapa[auxY][auxX]!=1){
                    TodasExplosoes.push(self.explosoes.create(x1,y,'explosao').play('meioLado'+animacao)); 
                }if(es && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==1 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                    if(jogadorAtual && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                        self.pontuacao+=10;
                    }
                    es=false;
                }
                auxX=(x2-26)/52;
                if(di && self.mapa[auxY][auxX]!=1){
                    TodasExplosoes.push(self.explosoes.create(x2,y,'explosao').play('meioLado'+animacao)); 
                }if(di && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==1 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                    if(jogadorAtual && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                        self.pontuacao+=10;
                    }
                    di=false
                }
                auxX=(x-26)/52;
                auxY=(y1-26)/52;
                if(ci && self.mapa[auxY][auxX]!=1){
                    TodasExplosoes.push(self.explosoes.create(x,y1,'explosao').play('meioCima'+animacao)); 
                }if(ci && (self.mapa[auxY][auxX]==1 || self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                    if(jogadorAtual && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                        self.pontuacao+=10;
                    }
                    ci=false
                }
                auxY=(y2-26)/52;
                if(ba && self.mapa[auxY][auxX]!=1){
                    TodasExplosoes.push(self.explosoes.create(x,y2,'explosao').play('meioCima'+animacao)); 
                }if(ba && (self.mapa[auxY][auxX]==1 || self.mapa[auxY][auxX] ==3 || self.mapa[auxY][auxX] ==-2 || self.mapa[auxY][auxX] ==-3 || self.mapa[auxY][auxX] ==-4)){
                    if(jogadorAtual && (self.mapa[auxY][auxX]==3 || self.mapa[auxY][auxX]==-2 || self.mapa[auxY][auxX]==-3 || self.mapa[auxY][auxX]==-4)){
                        self.pontuacao+=10;
                    }
                    ba=false
                }   
            }            
        }
        for(var i=0;i<TodasExplosoes.length;i++){
            TodasExplosoes[i].id=self.socket.id;
        }
        
            window.setTimeout(() => {
                for(var i=0;i<TodasExplosoes.length;i++){
                    TodasExplosoes[i].destroy();
                }
                self.mapa[(y-26)/52][(x-26)/52]=0;
            },1000);
        if(jogadorAtual){
            self.texto.setText((self.pontuacao+"").toUpperCase());
            self.texto.setOrigin(0.5);
        }
        
    }

    ativarDestruicao(caixa){
        caixa.play('destruicao');
        setTimeout(() => {
            var x=caixa.x,y=caixa.y;
            caixa.destroy();
            if(this.mapa[(y-26)/52][(x-26)/52]==-2){
                this.powerUps.create(x,y,'powerUpBomba');
            }else if(this.mapa[(y-26)/52][(x-26)/52]==-3){
                this.powerUps.create(x,y,'powerUpVelocidade');
            }else if(this.mapa[(y-26)/52][(x-26)/52]==-4){
                this.powerUps.create(x,y,'powerUpExplosao');
            }else{
                this.mapa[(y-26)/52][(x-26)/52]=0;
            }
        }, 1000);
    }
    
    pegarPowerUp(powerUp){
        if(this.mapa[(powerUp.y-26)/52][(powerUp.x-26)/52]==-2){
            this.socket.emit('powerUpPego','BOMBA');
            this.pontuacao+=100;
            this.texto.setText((this.pontuacao+"").toUpperCase());
            this.texto.setOrigin(0.5);
        }if(this.mapa[(powerUp.y-26)/52][(powerUp.x-26)/52]==-3){
            this.player.velocidade+=20;
            this.pontuacao+=100;
            this.texto.setText((this.pontuacao+"").toUpperCase());
            this.texto.setOrigin(0.5);
        } if(this.mapa[(powerUp.y-26)/52][(powerUp.x-26)/52]==-4){
            this.socket.emit('powerUpPego','POTENCIA');
            this.pontuacao+=100;
            this.texto.setText((this.pontuacao+"").toUpperCase());
            this.texto.setOrigin(0.5);
        }
        this.mapa[(powerUp.y-26)/52][(powerUp.x-26)/52]=0;
        powerUp.destroy(); 
        
    }

    destruirPowerUp(powerUp){
        this.mapa[(powerUp.y-26)/52][(powerUp.x-26)/52]=0;
        powerUp.destroy();
    }
    
    destruirPlayer(player,explosao){
        if(this.vivo==true){
            player.visible=false;
            this.socket.emit('playerEliminado',{pontuacao: this.pontuacao,kills: this.kills});
            this.vivo=false;
            this.socket.emit("Kill Servidor",explosao.id);
            let botaoFim = this.add.image(460, 338, "lose").
            setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal",{socket:this.socket})});;
            botaoFim.setOrigin(0.5);
            botaoFim.setScale(1.5);
        }
    
    }
    destruirPlayers(player,explosao){
        player.destroy();
    }
}

