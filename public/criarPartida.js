class criarPartida extends Phaser.Scene{

    constructor(){ 
        super("criarPartida");
    }

    preload(){
        this.load.image("fundoCriar", "img/telaCriarSala.jpg");
        this.load.image("botaoConfirmar", "img/botaoConfirmar.jpg");
        this.load.image("bombaIcone", "img/bombaIcone.png");
        this.load.image("seta", "img/seta.png");
        this.load.image("logo", "img/logoRefeitaLaranja.png");

        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }


    create(){

        this.add.image(490, 338, "fundoCriar");
    
        let logo = this.add.image(470, 180, "logo");
        logo.setScale(0.55);    

        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        let botaoConfirmar = this.add.image(475, 537, "botaoConfirmar").
        setInteractive().on('pointerdown', () => { this.scene.start("telaEspera")});;

        this.texto1 = this.add.bitmapText(135, 320, "gamma", 'NOME');
        this.texto1.setScale(1.3);

        this.texto2 = this.add.bitmapText(135, 394, "gamma", 'SENHA');
        this.texto2.setScale(1.3);

      
    }

}    