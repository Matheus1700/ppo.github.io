
class telaInicial extends Phaser.Scene{



constructor(){
    super("telaInicial");
}

preload(){
    this.load.image("fundo", "telaInicial.png");
    this.load.image("start", "start.png");

    this.load.audio("botaoClick", "audio/correctSound.mp3");
    this.load.audio("themeSong", "audio/FaketalesofSanFrancisco.mp3");
} 
    
create() {

    var audioConfig={
        delay: 0,
        volume: 1,
        loop: true
    }

    let soundSample = this.sound.add("botaoClick")
    let soundTrack = this.sound.add("themeSong")
    
    soundTrack.play(audioConfig);

    this.add.image(490, 338, "fundo");
    this.helloButton = this.add.image(490, 390, "start")
    .setInteractive().on('pointerdown', () => { this.scene.start("jogo")
    soundSample.play(); soundTrack.stop(); });
 
  }
  
}