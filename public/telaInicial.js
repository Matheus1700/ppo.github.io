
class telaInicial extends Phaser.Scene{

constructor(){
    super("telaInicial");
}

preload(){

    this.load.image("fundo", "img/telaCriarSala.jpg");
    
    this.load.image("botao", "img/botao.jpg");
    this.load.image("logo", "img/logoRefeitaLaranja.png");

    this.load.audio("botaoClick", "audio/correctSound.mp3");
    this.load.audio("themeSong", "audio/FaketalesofSanFrancisko.wav");

    this.load.path = './fontes/';
    this.load.image('gamma', 'font.png');
    this.load.json('gamma_json', 'gamma.json');

} 
    
create() {
    this.socket = io();
    console.log(this.socket.id);
    var audioConfig={
        delay: 0,
        volume: 1,
        loop: true
    }

    //Tornando um dos inputs invisível
    var input1 = document.getElementById("input1")
    .style.display = "none";
    //Adicionando trilha sonora
    let soundSample = this.sound.add("botaoClick")
    let soundTrack = this.sound.add("themeSong")
    let config = this.cache.json.get('gamma_json');

    soundTrack.play(audioConfig);

    this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

    
    this.add.image(490, 338, "fundo");
    
    let logo = this.add.image(470, 190, "logo");
    logo.setScale(0.6);
    
    /*
    this.texto1 = this.add.bitmapText(135, 320, "gamma", 'NOME');
    this.texto1.setScale(1.3);
    */

    this.texto2 = this.add.bitmapText(147, 394, "gamma", 'NOME');
    this.texto2.setScale(1.3);


    let botaoIniciar = this.add.image(475, 537, "botao").
    setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal",
    document.getElementById("input2").style.display = "none"
    )});;
    
    
    

  

}

  
}
