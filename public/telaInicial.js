
class telaInicial extends Phaser.Scene{

constructor(){
    super("telaInicial");
}

preload(){

    this.load.image("fundo", "telaInicial.png");

    this.load.audio("botaoClick", "audio/correctSound.mp3");
    this.load.audio("themeSong", "audio/FaketalesofSanFrancisko.wav");

    this.load.path = './fontes/';
    this.load.image('gamma', 'font.png');
    this.load.json('gamma_json', 'gamma.json');

} 
    
create() {


    var audioConfig={
        delay: 0,
        volume: 1,
        loop: true
    }


    let soundSample = this.sound.add("botaoClick")
    let soundTrack = this.sound.add("themeSong")
    let config = this.cache.json.get('gamma_json');

    soundTrack.play(audioConfig);

    this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

    this.add.image(490, 338, "fundo");

    this.botaoStart = this.add.bitmapText(388, 400, "gamma", 'START GAME')
    .setInteractive().on('pointerdown', () => { this.scene.start("jogo")
    soundSample.play(); soundTrack.stop(); });

    this.botaoStart.setFontSize(22);

}

  
}
