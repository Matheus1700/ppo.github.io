var config={
    width: 988,
    height: 676,
    scene: [telaInicial,telaCriarPartida, jogo],
    physics:{
        default: "arcade",
        arcade: {debug:false}    
    }
    
}

var game = new Phaser.Game(config)