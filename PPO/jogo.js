class jogo extends Phaser.Scene {
    
    constructor() {
        super("jogo");
    this.cursor;this.player;this.player1;this.player2;this.blocos;this.e=0;this.explosoes;this.bombas;this.anim;
    this.caixas;this.PUV;this.PUB;this.PUE;this.pause;this.cursor2={w:0,a:0,s:0,d:0,b:0};this.pontos1=0;this.pontos2=0;
    this.mapa = new Array(13);
    for(var i=0;i<13;i++){
        this.mapa[i]= new Array(19);
        for(var j=0;j<19;j++){
            this.mapa[i][j]=0;
        }
    }
    this.mapa[1][1]=-1; this.mapa[1][2]=-1; this.mapa[1][16]=-1; this.mapa[1][17]=-1; this.mapa[2][1]=-1; this.mapa[2][17]=-1;
    this.mapa[11][1]=-1; this.mapa[11][2]=-1; this.mapa[11][16]=-1; this.mapa[11][17]=-1; this.mapa[10][1]=-1;this.mapa[10][17]=-1;
    this.jogador1 = {quantidade:1,potencia:1,velocidade:160,vivo:true};
    this.jogador2 = {quantidade:1,potencia:1,velocidade:160,vivo:true};
    }
    

    preload(){

        game.scene.pause()

        this.load.image('tela','img/tela.jpg');
        this.load.spritesheet('personagem','img/dude.png',{
            frameWidth:32, frameHeight:42
        });
        this.load.spritesheet('bomba','img/bomba.png',{
            frameWidth:30, frameHeight:41
        });
        this.load.spritesheet('explosao','img/explosao.png',{
            frameWidth:52, frameHeight:52
        });
        this.load.spritesheet('caixa','img/caixa.png',{
            frameWidth:52, frameHeight:52
        });
        this.load.image('bloco','img/bloco.png');
        this.load.image('PUExplosao','img/PUExplosao.png');
        this.load.image('PUVelocidade','img/PUVelocidade.png');
        this.load.image('PUBomba','img/PUBomba.png');
        this.load.image('P1W','img/Player1 Wins.png');
        this.load.image('P2W','img/Player2 Wins.png');

        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');
    


    }

    create(){
        this.add.image(390,338,'tela');
        this.player = this.physics.add.group();
        this.player1 = this.player.create(78,78,'personagem');
        this.player2 = this.player.create(910,598,'personagem');
        this.bombas = this.physics.add.staticGroup();
        this.blocos = this.physics.add.staticGroup();
        this.explosoes = this.physics.add.staticGroup();
        this.caixas = this.physics.add.staticGroup();
        this.PUV = this.physics.add.staticGroup();
        this.PUE = this.physics.add.staticGroup();
        this.PUB = this.physics.add.staticGroup();

        let config = this.cache.json.get('gamma_json');

        this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));



        for(var i=0,y=26;i<13;i++){
            this.mapa[(y-26)/52][0]=1;
            this.blocos.create(26,y,'bloco');
            this.mapa[(y-26)/52][18]=1;
            this.blocos.create(962,y,'bloco');
            y+=52;
            
        }
        for(var i=0,x=78;i<17;i++){
            this.mapa[0][(x-26)/52]=1;
            this.blocos.create(x,26,'bloco');
            this.mapa[12][(x-26)/52]=1;
            this.blocos.create(x,650,'bloco');
            x+=52;
        }
        for(var i=0,y=130;i<5;i++){
            for(var j=0,x=130;j<8;j++){
                this.mapa[(y-26)/52][(x-26)/52]=1;
                this.blocos.create(x,y,'bloco');
                x+=104;
            }
            y+=104;
        }
        for(var i=1;i<12;i++){
            for(var j=1;j<18;j++){
                if( this.mapa[i][j]==0 && parseInt(Math.random()*10)>1){
                    this.mapa[i][j]=3;
                    this.caixas.create(j*52+26,i*52+26,'caixa');
                }
            }
        }
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor2.w =  this.input.keyboard.addKey(87);
        this.cursor2.a =  this.input.keyboard.addKey(65);
        this.cursor2.s =  this.input.keyboard.addKey(83);
        this.cursor2.d =  this.input.keyboard.addKey(68);
        this.cursor2.b =  this.input.keyboard.addKey(32);
        this.e=this.input.keyboard.addKey(13);
        

        this.physics.add.collider(this.player, this.blocos);
        this.physics.add.collider(this.player, this.bombas);
        this.physics.add.collider( this.player, this.caixas);
        this.physics.add.collider( this.bombas, this.explosoes, this.hitBomb,null,this);
        this.physics.add.collider( this.caixas,  this.explosoes, this.ativarDestruicao,null,this);

        this.physics.add.overlap(this.player1, this.PUV, this.coletarPUV1,null,this);
        this.physics.add.overlap(this.player1, this.PUE, this.coletarPUE1,null,this);
        this.physics.add.overlap(this.player1, this.PUB, this.coletarPUB1,null,this);
        this.physics.add.overlap(this.player2, this.PUV, this.coletarPUV2,null,this);
        this.physics.add.overlap(this.player2, this.PUE, this.coletarPUE2,null,this);
        this.physics.add.overlap(this.player2, this.PUB,  this.coletarPUB2,null,this);

        this.physics.add.overlap(this.player1, this.blocos,  this.morte1,null,this);
        this.physics.add.overlap( this.player2,this.blocos,  this.morte2,null,this);
        this.physics.add.overlap( this.explosoes, this.PUV,  this.destruirPU,null,this);
        this.physics.add.overlap( this.explosoes, this.PUE,  this.destruirPU,null,this);
        this.physics.add.overlap( this.explosoes, this.PUB, this.destruirPU,null,this);
        this.physics.add.overlap( this.player1,  this.explosoes,  this.morte1,null,this);
        this.physics.add.overlap( this.player2, this.explosoes, this.morte2,null,this);

        this.anims.create({
            key: "bombinha",
            frames: this.anims.generateFrameNumbers('bomba',{start: 0, end: 4}),
            frameRate: 5,
            repeate: -1
        });
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
            key: "destruicao",
            frames: this.anims.generateFrameNumbers('caixa',{start: 1, end: 6}),
            frameRate: 5,
            repeate: -1
        });

        this.anims.create({key: 'centroP',frames: [{key: 'explosao', frame: 0}],frameRate: 20});
        this.anims.create({key: 'meioCimaP',frames: [{key: 'explosao', frame: 1}],frameRate: 20});
        this.anims.create({key: 'meioLadoP',frames: [{key: 'explosao', frame: 2}],frameRate: 20});
        this.anims.create({key: 'cimaP',frames: [{key: 'explosao', frame:  3}],frameRate: 20});
        this.anims.create({key: 'baixoP',frames: [{key: 'explosao', frame: 4}],frameRate: 20});
        this.anims.create({key: 'direitaP',frames: [{key: 'explosao', frame: 5}],frameRate: 20});
        this.anims.create({key: 'esquerdaP',frames: [{key: 'explosao', frame: 6}],frameRate: 20});

        this.anims.create({key: 'centroM',frames: [{key: 'explosao', frame: 7}],frameRate: 20});
        this.anims.create({key: 'meioCimaM',frames: [{key: 'explosao', frame: 8}],frameRate: 20});
        this.anims.create({key: 'meioLadoM',frames: [{key: 'explosao', frame: 9}],frameRate: 20});
        this.anims.create({key: 'cimaM',frames: [{key: 'explosao', frame:  10}],frameRate: 20});
        this.anims.create({key: 'baixoM',frames: [{key: 'explosao', frame: 11}],frameRate: 20});
        this.anims.create({key: 'direitaM',frames: [{key: 'explosao', frame: 12}],frameRate: 20});
        this.anims.create({key: 'esquerdaM',frames: [{key: 'explosao', frame: 13}],frameRate: 20});

        this.anims.create({key: 'centroG',frames: [{key: 'explosao', frame: 14}],frameRate: 20});
        this.anims.create({key: 'meioCimaG',frames: [{key: 'explosao', frame: 15}],frameRate: 20});
        this.anims.create({key: 'meioLadoG',frames: [{key: 'explosao', frame: 16}],frameRate: 20});
        this.anims.create({key: 'cimaG',frames: [{key: 'explosao', frame:  17}],frameRate: 20});
        this.anims.create({key: 'baixoG',frames: [{key: 'explosao', frame: 18}],frameRate: 20});
        this.anims.create({key: 'direitaG',frames: [{key: 'explosao', frame: 19}],frameRate: 20});
        this.anims.create({key: 'esquerdaG',frames: [{key: 'explosao', frame: 20}],frameRate: 20});

        this.anims.create({key: 'centroGG',frames: [{key: 'explosao', frame: 21}],frameRate: 20});
        this.anims.create({key: 'meioCimaGG',frames: [{key: 'explosao', frame: 22}],frameRate: 20});
        this.anims.create({key: 'meioLadoGG',frames: [{key: 'explosao', frame: 23}],frameRate: 20});
        this.anims.create({key: 'cimaGG',frames: [{key: 'explosao', frame:  24}],frameRate: 20});
        this.anims.create({key: 'baixoGG',frames: [{key: 'explosao', frame: 25}],frameRate: 20});
        this.anims.create({key: 'direitaGG',frames: [{key: 'explosao', frame: 26}],frameRate: 20});
        this.anims.create({key: 'esquerdaGG',frames: [{key: 'explosao', frame: 27}],frameRate: 20});

        setTimeout(() => {
        this.fecharLinhaCima(1,18,1,[12,0,1,17,11,1,2,3]);
        }, 60000);
        

    }

    update(){


        if(this.cursor.right.isDown && this.jogador2.vivo){
            this.player2.setVelocityX(this.jogador2.velocidade);
            this.player2.anims.play('right',true);
        }else if(this.cursor.left.isDown && this.jogador2.vivo){
            this.player2.setVelocityX(-this.jogador2.velocidade);
            this.player2.anims.play('left',true);
        }else {
            this.player2.setVelocityX(0);
            this.player2.anims.play('turn');
        }
        if(this.cursor.up.isDown && this.jogador2.vivo){
            this.player2.setVelocityY(-this.jogador2.velocidade);
        }else if(this.cursor.down.isDown && this.jogador2.vivo){
            this.player2.setVelocityY(this.jogador2.velocidade);
        }else {
            this.player2.setVelocityY(0);
        }

        if(this.cursor2.d.isDown && this.jogador1.vivo){
            this.player1.setVelocityX(this.jogador1.velocidade);
            this.player1.anims.play('right',true);
        }else if(this.cursor2.a.isDown && this.jogador2.vivo){
            this.player1.setVelocityX(-this.jogador1.velocidade);
            this.player1.anims.play('left',true);
        }else {
            this.player1.setVelocityX(0);
            this.player1.anims.play('turn');
        }
        if(this.cursor2.w.isDown && this.jogador1.vivo){
            this.player1.setVelocityY(-this.jogador1.velocidade);
        }else if(this.cursor2.s.isDown && this.jogador1.vivo){
            this.player1.setVelocityY(this.jogador1.velocidade);
        }else {
            this.player1.setVelocityY(0);
        }
    
        if(this.cursor2.b.isDown && this.jogador1.vivo){
            var x = (Math.round((this.player1.x/52)-0.5)*52)+26;
            var y = (Math.round((this.player1.y/52)-0.5)*52)+26;
            if(this.jogador1.quantidade>0 && (this.mapa[(y-26)/52][(x-26)/52]==0 || this.mapa[(y-26)/52][(x-26)/52]==-1)){
                this.mapa[(y-26)/52][(x-26)/52]=2;
                var uma=this.bombas.create(x,y,'bomba').play('bombinha');
                this.jogador1.quantidade--;
                setTimeout(() => {
                    uma.play('bombinha');
                },1000);
                setTimeout(() => {
                    this.hitBomb(uma);
                        this.jogador1.quantidade++;
                },2000);
            
            }
        }
        
        if(this.e.isDown && this.jogador2.vivo){
            var x = (Math.round((this.player2.x/52)-0.5)*52)+26;
            var y = (Math.round((this.player2.y/52)-0.5)*52)+26;
            if(this.jogador2.quantidade>0 && (this.mapa[(y-26)/52][(x-26)/52]==0 || this.mapa[(y-26)/52][(x-26)/52]==-1)){
                this.mapa[(y-26)/52][(x-26)/52]=4;
                var uma=this.bombas.create(x,y,'bomba').play('bombinha');
                this.jogador2.quantidade--;
                setTimeout(() => {
                    uma.play('bombinha');
                },1000);
                setTimeout(() => {
                    this.hitBomb(uma);
                    this.jogador2.quantidade++;
                },2000);
            }
        }   

        

    }

    hitBomb(a){
        var x=a.x,y=a.y,p=0;
        if(this.mapa[(y-26)/52][(x-26)/52]==2){
            p=this.jogador1.potencia;
        }
        if(this.mapa[(y-26)/52][(x-26)/52]==4){
            p=this.jogador2.potencia;
        }
        if(p!=0){
            var animacao;
            a.destroy();
            if(p<=2){
                animacao='P';
            }else if(p>2 && p<=4){
                animacao='M';
            }else if(p>4 && p<=6){
                animacao='G';
            }else if(p>6){
                animacao='GG';
            }
            
            this.animB=false;
            
            var exs=new Array();
            exs.push(this.explosoes.create(x,y,'explosao').play('centro'+animacao));
            for(var i=0,es=true,di=true,ci=true,ba=true,x1=x,x2=x,y1=y,y2=y;i<p;i++){
                x1-=52;
                x2+=52;
                y1-=52;
                y2+=52;
                if(i==p-1){  
                    if(es && this.mapa[(y-26)/52][(x1-26)/52]!=1){
                        exs.push(this.explosoes.create(x1,y,'explosao').play('esquerda'+animacao));
                    }
                    if(di && this.mapa[(y-26)/52][(x2-26)/52]!=1){
                        exs.push(this.explosoes.create(x2,y,'explosao').play('direita'+animacao)); 
                    }
                    if(ci && this.mapa[(y1-26)/52][(x-26)/52]!=1){
                        exs.push(this.explosoes.create(x,y1,'explosao').play('cima'+animacao)); 
                    }
                    if(ba && this.mapa[(y2-26)/52][(x-26)/52]!=1){
                        exs.push(this.explosoes.create(x,y2,'explosao').play('baixo'+animacao)); 
                    }          
                }else{
                    var auxX=(x1-26)/52,auxY=(y-26)/52;
                    if(es && this.mapa[auxY][auxX]!=1){
                        exs.push(this.explosoes.create(x1,y,'explosao').play('meioLado'+animacao)); 
                    }if(es && (this.mapa[auxY][auxX]==3 || this.mapa[auxY][auxX]==1)){
                        es=false;
                    }
                    auxX=(x2-26)/52;
                    if(di && this.mapa[auxY][auxX]!=1){
                        exs.push(this.explosoes.create(x2,y,'explosao').play('meioLado'+animacao)); 
                    }if(di && (this.mapa[auxY][auxX]==3  || this.mapa[auxY][auxX]==1)){
                        di=false
                    }
                    auxX=(x-26)/52;
                    auxY=(y1-26)/52;
                    if(ci && this.mapa[auxY][auxX]!=1){
                        exs.push(this.explosoes.create(x,y1,'explosao').play('meioCima'+animacao)); 
                    }if(ci && (this.mapa[auxY][auxX]==1 || this.mapa[auxY][auxX]==3)){
                        ci=false
                    }
                    auxY=(y2-26)/52;
                    if(ba && this.mapa[auxY][auxX]!=1){
                        exs.push(this.explosoes.create(x,y2,'explosao').play('meioCima'+animacao)); 
                    }if(ba && (this.mapa[auxY][auxX]==1 || this.mapa[auxY][auxX] ==3)){
                        ba=false
                    }   
                }
                            
            }
                            
            window.setTimeout(() => {
                for(var i=0;i<exs.length;i++){
                    exs[i].destroy();
                }
                this.mapa[(y-26)/52][(x-26)/52]=0;
                
            },1000);
            
        }
    }


    ativarDestruicao(c){
        if(this.mapa[(c.y-26)/52][(c.x-26)/52]==3){
            this.mapa[(c.y-26)/52][(c.x-26)/52]=0;
            c.play('destruicao');
            setTimeout(() => {
                c.destroy();
                var r=parseInt(Math.random()*8);
                if(r==0){
                    this.PUB.create(c.x,c.y,'PUBomba');
                    this.mapa[(c.y-26)/52][(c.x-26)/52]=10;
                }if(r==1){
                    this.PUV.create(c.x,c.y,'PUVelocidade');
                    this.mapa[(c.y-26)/52][(c.x-26)/52]=10;
                } if(r==2){
                    this.PUE.create(c.x,c.y,'PUExplosao');
                    this.mapa[(c.y-26)/52][(c.x-26)/52]=10;
                }
            }, 1000);
        }    
    }
    
    coletarPUV1(pl,p){
        p.destroy();
        this.jogador1.velocidade+=25;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }
    coletarPUB1(pl,p){
        p.destroy();
        this.jogador1.quantidade++;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }
    coletarPUE1(pl,p){
        p.destroy();
        this.jogador1.potencia++;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }
    coletarPUV2(pl,p){
        p.destroy();
        this.jogador2.velocidade+=25;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }
    coletarPUB2(pl,p){
        p.destroy();
        this.jogador2.quantidade++;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }
    coletarPUE2(pl,p){
        p.destroy();
        this.jogador2.potencia++;
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }

    destruirPU(e,p){
        p.destroy();
        this.mapa[(p.y-26)/52][(p.x-26)/52]=0;
    }

    morte1(p,e){
        this.add.image(494,338,'P2W');

        this.helloButton = this.add.bitmapText(388, 400, "gamma", 'START GAME')
        .setInteractive().on('pointerdown', () => {window.location.reload();});


        p.disableBody(true,true);
        this.jogador1.vivo=false;
        for(;this.jogador1.potencia>1;this.jogador1.potencia--){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUE.create(x*52+26,y*52+26,'PUExplosao');
        }
        for(;this.jogador1.quantidade>1;this.jogador1.quantidade--){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUB.create(x*52+26,y*52+26,'PUBomba');
        }
        for(;this.jogador1.velocidade>160;this.jogador1.velocidade-=25){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUV.create(x*52+26,y*52+26,'PUVelocidade');
        }
    }

    morte2(p,e){
        this.add.image(494,338,'P1W');
        
        this.helloButton = this.add.bitmapText(388, 400, "gamma", 'START GAME')
        .setInteractive().on('pointerdown', () => {window.location.reload();});

        p.disableBody(true,true);
        this.jogador2.vivo=false;
        for(;this.jogador2.potencia>1;this.jogador2.potencia--){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUE.create(x*52+26,y*52+26,'PUExplosao');
        }
        for(;this.jogador2.quantidade>1;this.jogador2.quantidade--){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUB.create(x*52+26,y*52+26,'PUBomba');
        }
        for(;this.jogador2.velocidade>160;this.jogador2.velocidade-=25){
            var x=parseInt(Math.random()*19);
            var y=parseInt(Math.random()*13);
            while(this.mapa[y][x]!=0){
                x=parseInt(Math.random()*19);
                y=parseInt(Math.random()*13);
            }
            this.PUV.create(x*52+26,y*52+26,'PUVelocidade');
        }
    }

    fecharLinhaCima(inicio,final,fixo,finalP){
        if(inicio<final){
            if( this.mapa[fixo][inicio]!=1){
                setTimeout(() => {
                    var x=inicio*52+26,y=fixo*52+26;
                    this.mapa[fixo][inicio]=1;
                    this.blocos.create(x,y,'bloco');
                    this.fecharLinhaCima(inicio+1,final,fixo,finalP);
                }, 500);
            }else{
                this.fecharLinhaCima(inicio+1,final,fixo,finalP);
            }
        }else{
            this.fecharColunaDireita(fixo+1,finalP.shift(),inicio-1,finalP);
        }
    }

    fecharColunaDireita(inicio,final,fixo,finalP){
        if(inicio<final){
            if(this.mapa[inicio][fixo]!=1){
                setTimeout(() => {
                    var x=fixo*52+26,y=inicio*52+26;
                    this.mapa[inicio][fixo]=1;
                    this.blocos.create(x,y,'bloco');
                    this.fecharColunaDireita(inicio+1,final,fixo,finalP);
                }, 500);
            }else{
                this.fecharColunaDireita(inicio+1,final,fixo,finalP);
            }
        }else{
            this.fecharLinhaBaixo(fixo-1,finalP.shift(),inicio-1,finalP);
        }
    }
    fecharLinhaBaixo(inicio,final,fixo,finalP){
        if(inicio>final){
            if(this.mapa[fixo][inicio]!=1){
                setTimeout(() => {
                    var x=inicio*52+26,y=fixo*52+26;
                    this.mapa[fixo][inicio]=1;
                    this.blocos.create(x,y,'bloco');
                    this.fecharLinhaBaixo(inicio-1,final,fixo,finalP);
                }, 500);
            }else{
                this.fecharLinhaBaixo(inicio-1,final,fixo,finalP);
            }
            
        }else{
            this.fecharColunaEsquerda(fixo-1,finalP.shift(),inicio+1,finalP);
        }
    }
    fecharColunaEsquerda(inicio,final,fixo,finalP){
        if(inicio>final){
            if(this.mapa[inicio][fixo]!=1){
                setTimeout(() => {
                    var x=fixo*52+26,y=inicio*52+26;
                    this.mapa[inicio][fixo]=1;
                    this.blocos.create(x,y,'bloco');
                    this.fecharColunaEsquerda(inicio-1,final,fixo,finalP);
                }, 500);
            }else{
                this.fecharColunaEsquerda(inicio-1,final,fixo,finalP);
            }
        }else{
            this.fecharLinhaCima(fixo+1,finalP.shift(),inicio+1,finalP);
        }
    }
}
