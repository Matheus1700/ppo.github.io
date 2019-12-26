class telaEsperaPlayer extends Phaser.Scene{

    constructor(){ 
        super("telaEsperaPlayer");
    }
    init(data){
        this.socket=data.socket;
        this.sala=data.nome;
    }
    preload(){
        this.load.image("fundoEspera", "img/telaEsperaPlayer.jpg");
        this.load.image("seta", "img/seta.png");
        this.load.image("playerEspera", "img/botaoPlayer.png");


        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }


    create(){

        this.add.image(490, 338, "fundoEspera");
    
        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        let divPlayer = this.add.image(390, 300, "playerEspera");
        divPlayer.setScale(0.5);

        this.socket.on('Lets go',() => {
            this.scene.start("jogo",{socket: this.socket, sala: this.sala});
        });
        this.socket.on('Players insuficientes',() => {
            alert("Players insuficientes");
        });

        

            
        

      
    }

}    