class telaCriarPartida extends Phaser.Scene{

    constructor(){
        super("telaCriarPartida");
    }

    preload(){
        this.load.image("fundo2", "img/telaSelecao.png");
        this.load.image("botao", "img/botaoSelecaoMapa.png");

    }

    create(){
        var x = this.add.image(490, 338, "fundo2");
        x.setScale(0.8);


        this.botaoEntrar2 = this.add.image(490, 338, "botao").setInteractive().on('pointerdown', () => {
        this.scene.start("jogo")});

        this.texto = this.add.bitmapText(70, 110, "gamma", 'ENTRAR EM UMA PARTIDA');

        this.texto = this.add.bitmapText(600, 110, "gamma", 'VER ESTATÍSTICAS');

        this.texto.setFontSize(17);
    }
}