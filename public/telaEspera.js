class telaEspera extends Phaser.Scene{

    constructor(){ 
        super("telaEspera");
    }
    init(data){
        this.socket=data.socket;
        console.log(this.socket.id);
    }
    preload(){
        this.load.image("fundoEspera", "img/telaEspera.jpg");
        this.load.image("botaoIniciar", "img/botao.jpg");
        this.load.image("seta", "img/seta.png");

        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }


    create(){

        this.add.image(490, 338, "fundoEspera");
    
        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        let botaoIniciar = this.add.image(475, 565, "botaoIniciar").setScale(0.9).
        setInteractive().on('pointerdown', () => { this.scene.start("jogo",{socket: this.socket, sala: "teste"})});

      
    }

}    