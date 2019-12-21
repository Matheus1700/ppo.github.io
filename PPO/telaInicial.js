
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
 
    var audioConfig={
        delay: 0,
        volume: 1,
        loop: true
    }

    //Aqui ta criando o elemento INPUT no JS usando a tag 'input1'
    // que já tinha sido criado no telaInicialHtml
    var inputUm = document.createElement("input1");
    var inputDois = document.createElement("input2");
    
    let soundSample = this.sound.add("botaoClick")
    let soundTrack = this.sound.add("themeSong")
    let config = this.cache.json.get('gamma_json');

    soundTrack.play(audioConfig);

    this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));

    
    this.add.image(490, 338, "fundo");
    
    let logo = this.add.image(470, 180, "logo");
    logo.setScale(0.55);
    
    this.texto1 = this.add.bitmapText(135, 320, "gamma", 'NOME');
    this.texto1.setScale(1.3);

    this.texto2 = this.add.bitmapText(135, 394, "gamma", 'SENHA');
    this.texto2.setScale(1.3);

    
    let botaoIniciar = this.add.image(475, 537, "botao").
    setInteractive().on('pointerdown', () => { this.scene.start("menuPrincipal",
    document.getElementById("input1").style.display = "none",
    document.getElementById("input2").style.display = "none"   
    )
}
);;
    
    
    

  

}

  
}
