var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var salas ={};

app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/telaInicial.html');
});

io.on('connection', function (socket) {
    var sala=undefined;
    var nome="";
    socket.on('Nome jogador',(name)=>{
      nome = name;
    });
    socket.on('entrou',()=>{
      console.log(sala)
      socket.emit('mapa', salas[sala].mapa);
      addPlayer({socket: socket, nome: sala});
      socket.emit('passandoPlayers', salas[sala].players);
      socket.broadcast.to(sala).emit('novoPlayer', salas[sala].players[socket.id]);
    });
    socket.on('Entrar Sala',(dados)=>{
      if(salas[dados.nome].senha == dados.senha){
        sala=dados.nome;
        socket.join(dados.nome);
        socket.emit("Senha certa")
      }else{
        socket.emit("Senha errada")
      }
      
    });

    socket.on('Verificar nome',(dados)=>{
      if(salas[dados.nome] == undefined){
        socket.emit("Aprovado")
      }else{
        socket.emit("Reprovado")
        
      }
    });
    socket.on('Criar sala',(dados) => {
      salas[dados.nome] = {
        criador: nome,
        nome: dados.nome,
        senha: dados.senha,
        quantidade: 1,
        iniciada: false,
        mapa: undefined,
        players: {}
      }
      sala=dados.nome;
      criandoMapa(dados.nome);
      socket.join(dados.nome);

      //passando mapa
      
    });
    
    // player movimentando
    socket.on('playerMovimentando', movementData => {
      salas[sala].players[socket.id].x = movementData.x;
      salas[sala].players[socket.id].y = movementData.y;
      salas[sala].players[socket.id].direcao = movementData.direcao;

      // avisa quando se moverem
      socket.broadcast.to(sala).emit('playerMovimentou', salas[sala].players[socket.id]);
    });
    //Verificar e criando bomba
    socket.on('verificarBomba',playerInfo => {
      if(salas[sala].players[playerInfo.Id].quantidade>0){
        salas[sala].players[playerInfo.Id].quantidade-=1;
        playerInfo.potencia =  salas[sala].players[playerInfo.Id].potencia;
        io.emit('criarBomba',playerInfo);
      }
    });

    socket.on('destruidoBomba',() => {
      salas[sala].players[socket.id].quantidade+=1;
    });

    socket.on('powerUpPego', tipo =>{
      if(tipo=="BOMBA"){
        salas[sala].players[socket.id].quantidade+=1;
      }
      if(tipo=="POTENCIA"){
        salas[sala].players[socket.id].potencia+=1;
      }
    });

    socket.on('playerEliminado',() => {
      socket.broadcast.to(sala).emit('desconectado', socket.id);
      salas[sala].players.splice(socket.id,1)
      salas[sala].quantidade-=1
      delete salas[sala].players[socket.id]
    });

    socket.on('disconnect',() => {
      console.log('user disconnected');
      if(sala!=undefined){
        socket.broadcast.to(sala).emit('desconectado', socket.id);
        delete salas[sala].players[socket.id]
        salas[sala].quantidade-=1
      }
      
    });
});

function criandoMapa(nome){

  //Criando a matriz 
  salas[nome].mapa = new Array(13);
  for(var i=0;i<13;i++){
    salas[nome].mapa[i]= new Array(19);
    for(var j=0;j<19;j++){
      salas[nome].mapa[i][j]=0;
    }
  }

  //adicionando as bordas laterais do mapa 
  for(var i=0;i<13;i++){
    salas[nome].mapa[i][0]=1;
    salas[nome].mapa[i][18]=1;
  }

  //adicionando as bordas do topo e de baixo do mapa 
  for(var i=0;i<18;i++){
    salas[nome].mapa[0][i]=1;
    salas[nome].mapa[12][i]=1;
  }

  //adicionando as pedras no meio do mapa
  for(var i=2;i<13;i+=2){
    for(var j=2;j<19;j+=2){
      salas[nome].mapa[i][j]=1;
    }
  }

  //criando as caixas e definindo os PowerUps nelas
  for(var i=1;i<12;i++){
    for(var j=1;j<18;j++){
      if( salas[nome].mapa[i][j]==0 && parseInt(Math.random()*10)>1){
        let random=parseInt(Math.random()*7);
        if(random==0){
          salas[nome].mapa[i][j]=-2;
        }else if(random==1){
          salas[nome].mapa[i][j]=-3;
        }else if(random==2){
          salas[nome].mapa[i][j]=-4;
        }else{
          salas[nome].mapa[i][j]=3;          
        }
      }
    }
  }

  salas[nome].mapa[1][1]=-1; 
  salas[nome].mapa[1][2]=-1; 
  salas[nome].mapa[1][16]=-1; 
  salas[nome].mapa[1][17]=-1; 
  salas[nome].mapa[2][1]=-1; 
  salas[nome].mapa[2][17]=-1;
  salas[nome].mapa[11][1]=-1; 
  salas[nome].mapa[11][2]=-1; 
  salas[nome].mapa[11][16]=-1; 
  salas[nome].mapa[11][17]=-1; 
  salas[nome].mapa[10][1]=-1;
  salas[nome].mapa[10][17]=-1;
}

function addPlayer(dados){
  //adicionando as posiçoes de cada player a medida que conectam
  if(salas[dados.nome].quantidade==1){
    salas[dados.nome].quantidade+=1;
    salas[dados.nome].players[dados.socket.id]={
      playerId: dados.socket.id,
      x: 78,
      y: 78,
      direcao: 'turn',
      potencia: 1,
      quantidade:1,
      vivo: true
    }
  }else if(salas[dados.nome].quantidade==2){
    salas[dados.nome].quantidade+=1;
    salas[dados.nome].players[dados.socket.id]={
      playerId: dados.socket.id,
      x: 910,
      y: 598,
      direcao: 'turn',
      potencia: 1,
      quantidade: 1,
      vivo: true
    }
  }else if(salas[dados.nome].quantidade==3){
    salas[dados.nome].quantidade+=1;
    salas[dados.nome].players[dados.socket.id]={
      playerId: dados.socket.id,
      x: 78,
      y: 598,
      direcao: 'turn',
      potencia: 1,
      quantidade: 1,
      vivo: true
    }
  }else if(salas[dados.nome].quantidade==4){
    salas[dados.nome].quantidade+=1;
    salas[dados.nome].players[dados.socket.id]={
      playerId: dados.socket.id,
      x: 910,
      y: 78,
      direcao: 'turn',
      potencia: 1,
      quantidade: 1,
      vivo: true
    }
  }else{
    //dados.socket.emit('Sala Cheia');
    console.log("opaaa")
  }

}
server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});