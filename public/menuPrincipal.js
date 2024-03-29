class menuPrincipal extends Phaser.Scene{

    constructor(){
        super("menuPrincipal");
    }
    init(data){
        this.socket=data.socket;
    }
    preload(){
        this.load.image("fundo2", "img/telaNormal.jpg");
        //this.load.image("fundo3", "img/telaSimples.jpg");

        this.load.image("botaoCriar1", "img/botaoCriar.png");
        this.load.image("botaoEstatistica1", "img/botaoEstatistica.png");
        this.load.image("botaoFechar1", "img/botaoFechar.png");
        this.load.image("botaoIniciar1", "img/botaoIniciar.png");

        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');
    }

    create(){
        this.socket.emit("Atualizar");
        var x = this.add.image(490, 338, "fundo2");
        x.setScale(0.75);

        this.socket.on('Indefinido',()=>{
            alert("Erro logue de novo");
        });
        let botaoCriar = this.add.image(664.5, 270, "botaoCriar1").setScale(0.55).
        setInteractive().on('pointerdown', () => { 
            this.scene.start("criarPartida",{socket: this.socket},
            document.getElementById("input1").style.display = "inline",
            document.getElementById("input2").style.display = "inline"
        )});

        let botaoEstatistica = this.add.image(664.5, 410, "botaoEstatistica1").setScale(0.55)
        .setInteractive().on('pointerdown', () => { this.scene.start("estatisticas",{socket: this.socket})
        });

        let botaoIniciar = this.add.image(664.5, 605, "botaoIniciar1").setScale(0.55)
        .setInteractive().on('pointerdown', () => { this.scene.start("entrarPartida",{socket: this.socket})
        document.getElementById("input1").style.display = "inline"
        document.getElementById("input2").style.display = "inline"});

        let botaoFechar = this.add.image(664.5, 555, "botaoFechar1").setScale(0.55)
        .setInteractive().on('pointerdown', () => { this.scene.start("telaInicial"),
        document.getElementById("input2").style.display = "inline";}
        )
         ;

       
        let config = this.cache.json.get('gamma_json');
        this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.texto1 = this.add.bitmapText(450, 218, "gamma", 'CRIAR PARTIDA');
        this.texto1.setScale(1.5);

        this.texto2 = this.add.bitmapText(452, 286, "gamma", 'ESTATISTICAS');
        this.texto2.setScale(1.5);

        this.texto3 = this.add.bitmapText(452, 358, "gamma", 'BUSCAR PARTIDA');
        this.texto3.setScale(1.5);

        this.texto4 = this.add.bitmapText(452, 431, "gamma", 'SAIR');
        this.texto4.setScale(1.5);
       
        this.textoMenu = this.add.bitmapText(10, 40, "gamma", 'MENU PRINCIPAL');
        this.textoMenu.setScale(2);



        botaoCriar.setInteractive();    
        
        botaoCriar.on("pointerover", ()=>{
            botaoCriar = (664.5, 270, "botaoCriar2");
            console.log("pointerOver funciona");
        })

        botaoCriar.on("pointerout", ()=>{
            botaoCriar = ("botaoCriar1");
            console.log("pointerOut funciona");

        })

      
    }
}