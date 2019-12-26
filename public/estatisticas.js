class estatisticas extends Phaser.Scene{

    /*COLOCAR UMA SETA PARA VOLTAR*/
    constructor(){ 
        super("estatisticas");
    }

    init(dados){
        this.socket=dados.socket;
        this.socket.emit('Estatisticas');
        this.socket.on('Dados',(dados)=>{
            this.dados=dados;
        });
    };

    preload(){
        this.load.image("fundoEstatistica", "img/telaEstatistica.png");
        this.load.image("seta", "img/seta.png");


        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }

    create(){

        this.add.image(490, 338, "fundoEstatistica").
        setScale(1.26, 1.25);

        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        this.texto1 = this.add.bitmapText(280, 240, "gamma", this.dados.nome.toUpperCase());
        this.texto1.setOrigin(0.5);
        this.texto1.setScale(1.55);

        this.texto2 = this.add.bitmapText(280, 345, "gamma", (this.dados.kills+"").toUpperCase());
        this.texto2.setOrigin(0.5);
        this.texto2.setScale(1.55);

        this.texto3 = this.add.bitmapText(280, 450, "gamma", (this.dados.pontuacaoTotal+"").toUpperCase());
        this.texto3.setOrigin(0.5);
        this.texto3.setScale(1.55);

        this.texto4 = this.add.bitmapText(280, 555, "gamma", (this.dados.pontuacaoMaior+"").toUpperCase());
        this.texto4.setOrigin(0.5);
        this.texto4.setScale(1.55);

        this.texto5 = this.add.bitmapText(690, 240, "gamma", (this.dados.partidasTotal+"").toUpperCase());
        this.texto5.setOrigin(0.5);
        this.texto5.setScale(1.55);

        this.texto6 = this.add.bitmapText(690, 345, "gamma", (this.dados.pontuacaoMaior+"").toUpperCase());
        this.texto6.setOrigin(0.5);
        this.texto6.setScale(1.55);

        this.texto7 = this.add.bitmapText(690, 450, "gamma", (this.dados.partidasGanhas+"").toUpperCase());
        this.texto7.setOrigin(0.5);
        this.texto7.setScale(1.55);

        this.texto8 = this.add.bitmapText(690, 555, "gamma", (this.dados.death+"").toUpperCase());
        this.texto8.setOrigin(0.5);
        this.texto8.setScale(1.55);
        


    }

}    