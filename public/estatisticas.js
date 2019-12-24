class estatisticas extends Phaser.Scene{

    /*COLOCAR UMA SETA PARA VOLTAR*/
    constructor(){ 
        super("estatisticas");
    }

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

        /*
        this.texto1 = this.add.bitmapText(225, 180, "gamma", 'NOME');
        this.texto1.setScale(1.55);

        this.texto2 = this.add.bitmapText(220, 285, "gamma", 'KILLS');
        this.texto2.setScale(1.55);

        this.texto3 = this.add.bitmapText(145, 390, "gamma", 'SCORE TOTAL');
        this.texto3.setScale(1.55);

        this.texto4 = this.add.bitmapText(147, 495, "gamma", 'SCORE MAIOR');
        this.texto4.setScale(1.55);

        this.texto5 = this.add.bitmapText(595, 180, "gamma", 'PARTIDAS');
        this.texto5.setScale(1.55);

        this.texto6 = this.add.bitmapText(605, 285, "gamma", 'RANKING');
        this.texto6.setScale(1.55);

        this.texto7 = this.add.bitmapText(595, 390, "gamma", 'VITORIAS');
        this.texto7.setScale(1.55);

        this.texto8 = this.add.bitmapText(595, 495, "gamma", 'DERROTAS');
        this.texto8.setScale(1.55);
        */


    }

}    