
class telaInicial extends Phaser.Scene{

constructor(){
    super("telaInicial");
}

preload(){

    this.load.image("fundo", "img/telaInicial.jpg");
    
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

    //Aqui ta criando o elemento INPUT no JS usando a tag 'input1'
    // que já tinha sido criado no telaInicialHtml
    var inputUm = document.createElement("input");
    inputUm.setAttribute('id', 'input1');
    var inputDois = document.createElement("input");
    inputDois.setAttribute('id', 'input2');
    //Tornando um dos inputs invisível
     inputUm = document.getElementById("input1")
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

    this.socket.on('Dados resgatados',()=>{
        document.getElementById('input2').value = "";
        document.getElementById("input1").style.display = "none";
        document.getElementById("input2").style.display = "none";
        this.scene.start("menuPrincipal",{socket: this.socket}) 
    });

    let botaoIniciar = this.add.image(475, 537, "botao").setInteractive().on('pointerdown', () => {
        var nome= document.getElementById('input2').value;
        if(nome!=""){
            this.socket.emit('Nome jogador',nome)
        }else{
            alert("Você precisa colocar um nome");
        }
    });;

    //
    
    
    
    

  

}

  
}
