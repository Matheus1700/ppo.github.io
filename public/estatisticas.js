class estatisticas extends Phaser.Scene{

    /*COLOCAR UMA SETA PARA VOLTAR*/
    constructor(){ 
        super("estatisticas");
    }

    preload(){
        this.load.image("fundoEstatistica", "img/telaEstatistica2.jpg");
        this.load.image("seta", "img/seta.png");


        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }

    create(){

        this.add.image(490, 338, "fundoEstatistica");

        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        this.texto1 = this.add.bitmapText(220, 100, "gamma", 'NOME');
        this.texto1.setScale(1.7);

        this.texto2 = this.add.bitmapText(560, 100, "gamma", 'PONTOS');
        this.texto2.setScale(1.7);

    }

}    