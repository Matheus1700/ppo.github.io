class criarPartida extends Phaser.Scene{

    constructor(){ 
        super("criarPartida");
    }
    init(data){
        this.socket=data.socket;
    }
    preload(){
        this.load.image("fundoCriar", "img/telaCriarSala.jpg");
        this.load.image("botaoConfirmar", "img/botaoConfirmar.jpg");
        this.load.image("bombaIcone", "img/bombaIcone.png");
        this.load.image("seta", "img/seta.png");
        this.load.image("logo", "img/logoRefeitaLaranja.png");

        this.load.path = './fontes/';
        this.load.image('gamma', 'font.png');
        this.load.json('gamma_json', 'gamma.json');

        


    }


    create(){
        var inputUm = document.createElement("input");
        inputUm.setAttribute('id', 'input1');
        var inputDois = document.createElement("input");
        inputDois.setAttribute('id', 'input2');
        this.add.image(490, 338, "fundoCriar");

        let logo = this.add.image(470, 180, "logo");
        logo.setScale(0.55);    

        
        this.socket.on('Aprovado',()=>{
            var nome= document.getElementById('input1').value;
            var senha= document.getElementById('input2').value;
            this.socket.emit('Criar sala',{nome: nome, senha: senha});
            document.getElementById("input1").style.display = "none";
            document.getElementById("input2").style.display = "none";
            document.getElementById('input1').value="";
            document.getElementById('input2').value="";
            this.scene.start("telaEspera",{socket: this.socket, sala: nome});
        });
        this.socket.on('Reprovado',()=>{
            alert("Nome ja utilizado");
        });
        

        let seta = this.add.image(30, 40, "seta").

        setInteractive().on('pointerdown', () => {
            document.getElementById("input1").style.display = "none";
            document.getElementById("input2").style.display = "none";
            this.scene.start("menuPrincipal",{socket: this.socket})
            
        });
        seta.setScale(0.1);

        let botaoConfirmar = this.add.image(475, 537, "botaoConfirmar").
        setInteractive().on('pointerdown', () => {
            var nome= document.getElementById('input1').value;
            var senha= document.getElementById('input2').value;
            if(nome==""){
                alert("O nome não pode estar vazio");
            }else if(senha==''){
                alert("A senha não pode estar vazio");
            }else{
                this.socket.emit("Verificar nome",{nome: nome});
            }
            
        });

        this.texto1 = this.add.bitmapText(135, 320, "gamma", 'NOME');
        this.texto1.setScale(1.3);

        this.texto2 = this.add.bitmapText(135, 394, "gamma", 'SENHA');
        this.texto2.setScale(1.3);

            

        

        
        
      
    }

}    