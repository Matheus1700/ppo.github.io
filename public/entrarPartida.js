class entrarPartida extends Phaser.Scene{

    constructor(){ 
        super("entrarPartida");
    }
    init(data){
        this.socket=data.socket;
    }

    preload(){
        this.load.image("fundoEntrar", "img/telaEntrarSala.jpg");
        this.load.image("botaoEntrar", "img/botaoEntrar.jpg");
        this.load.image("seta", "img/seta.png");


        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

    }

    create(){
        
        this.socket.on("Senha errada",()=>{
            alert("Senha incorreta");
        });
        this.socket.on("Senha certa",()=>{
            this.scene.start("telaEspera",{socket: this.socket});
        });
        this.add.image(490, 338, "fundoEntrar");

        let seta = this.add.image(30, 40, "seta").
        setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal")});;
        seta.setScale(0.1);

        this.texto1 = this.add.bitmapText(225, 100, "gamma", 'SALA');
        this.texto1.setScale(1.7);

        this.texto2 = this.add.bitmapText(545, 100, "gamma", 'CRIADOR');
        this.texto2.setScale(1.7);

        this.texto3 = this.add.bitmapText(390, 510, "gamma", 'ENTRAR');
        this.texto3.setScale(1.7);

        let botaoEntrar = this.add.image(475, 523, "botaoEntrar").
        setInteractive().on('pointerdown', () => { 
            this.socket.emit("Entrar Sala",{nome: "teste", senha:"1234"});
        });

      
    }

}    