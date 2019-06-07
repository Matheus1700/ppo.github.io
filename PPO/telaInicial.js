
class telaInicial extends Phaser.Scene{

constructor(){
    super("telaInicial");
}

preload(){
    this.load.image("fundo", "telaInicial.png");
    this.load.image("start", "start.png");

    this.load.audio("botaoClick", "audio/correctSound.mp3");
} 
    
create() {
    this.add.image(490, 338, "fundo");
    this.helloButton = this.add.image(490, 390, "start")
    .setInteractive().on('pointerdown', () => { 
        let soundSample = this.sound.add("botaoClick");
        soundSample.play();
        this.scene.start("jogo") });


    
  }
  
}