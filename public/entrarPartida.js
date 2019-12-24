class entrarPartida extends Phaser.Scene{

    constructor(){ 
        super("entrarPartida");
    }
    init(data){
        this.socket=data.socket;
    }

    preload(){
        this.load.image("fundoEntrar", "img/telaCriarSala.jpg");
        this.load.image("botaoEntrar", "img/botaoEntrar.jpg");
        this.load.image("seta", "img/seta.png");
        this.load.image("logo", "img/logoRefeitaLaranja.png");

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
        let logo = this.add.image(470, 190, "logo");
        logo.setScale(0.5);

        this.texto1 = this.add.bitmapText(135, 320, "gamma", 'NOME');
        this.texto1.setScale(1.5);

        this.texto2 = this.add.bitmapText(135, 394, "gamma", 'SENHA');
        this.texto2.setScale(1.5);

    
        let botaoEntrar = this.add.image(475, 530, "botaoEntrar").
        setInteractive().on('pointerdown', () => { 
            this.socket.emit("Entrar Sala",{nome: "teste", senha:"1234"}),
            document.getElementById("input1").style.display = "none",
            document.getElementById("input2").style.display = "none";
        });

    
    }

}    