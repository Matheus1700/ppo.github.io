var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
players.length=0
var mapa;


app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/telaInicial.html');
});

io.on('connection', function (socket) {
    //adicionando player
    addPlayer(socket);
    console.log('a user connected ' + players.length);
    if(mapa==undefined){
      criandoMapa();
    }
    //passando mapa
    socket.emit('mapa', mapa);
    // passando todos os players
    socket.emit('passandoPlayers', players);
    // passando novo player
    socket.broadcast.emit('novoPlayer', players[socket.id]);
    // player movimentando
    socket.on('playerMovimentando', movementData => {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;

      // avisa quando se moverem
      socket.broadcast.emit('playerMovimentou', players[socket.id]);
    });

    socket.on('disconnect',() => {
      console.log('user disconnected');
      socket.broadcast.emit('desconectado', socket.id);
      delete players[socket.id];
      players.length-=1;
    });
});

function criandoMapa(){

  //Criando a matriz 
  mapa = new Array(13);
  for(var i=0;i<13;i++){
    mapa[i]= new Array(19);
    for(var j=0;j<19;j++){
      mapa[i][j]=0;
    }
  }

  //adicionando as bordas laterais do mapa 
  for(var i=0;i<13;i++){
    mapa[i][0]=1;
    mapa[i][18]=1;
  }

  //adicionando as bordas do topo e de baixo do mapa 
  for(var i=0;i<18;i++){
    mapa[0][i]=1;
    mapa[12][i]=1;
  }

  //adicionando as pedras no meio do mapa
  for(var i=2;i<13;i+=2){
    for(var j=2;j<19;j+=2){
      mapa[i][j]=1;
    }
  }

  //criando as caixas e definindo os PowerUps nelas
  for(var i=1;i<12;i++){
    for(var j=1;j<18;j++){
      if( mapa[i][j]==0 && parseInt(Math.random()*10)>1){
        let random=parseInt(Math.random()*7);
        if(random==0){
          mapa[i][j]=-2;
        }else if(random==1){
          mapa[i][j]=-3;
        }else if(random==2){
          mapa[i][j]=-4;
        }else{
          mapa[i][j]=3;          
        }
      }
    }
  }

  mapa[1][1]=-1; 
  mapa[1][2]=-1; 
  mapa[1][16]=-1; 
  mapa[1][17]=-1; 
  mapa[2][1]=-1; 
  mapa[2][17]=-1;
  mapa[11][1]=-1; 
  mapa[11][2]=-1; 
  mapa[11][16]=-1; 
  mapa[11][17]=-1; 
  mapa[10][1]=-1;
  mapa[10][17]=-1;
}

function addPlayer(socket){
  //adicionando as posiçoes de cada player a medida que conectam
  if(players.length==0){
    criandoMapa();
    players.length+=1;
    players[socket.id]={
      playerId: socket.id,
      x: 78,
      y: 78,
      direcao: 'parado',
      potencia: 1,
      num:1,
      vivo: true
    }
  }else if(players.length==1){
    players.length+=1;
    players[socket.id]={
      playerId: socket.id,
      x: 910,
      y: 598,
      direcao: 'parado',
      potencia: 1,
      num:2,
      vivo: true
    }
  }else if(players.length==2){
    players.length+=1;
    players[socket.id]={
      playerId: socket.id,
      x: 78,
      y: 598,
      direcao: 'parado',
      potencia: 1,
      num:2,
      vivo: true
    }
  }else if(players.length==3){
    players.length+=1;
    players[socket.id]={
      playerId: socket.id,
      x: 910,
      y: 78,
      direcao: 'parado',
      potencia: 1,
      num:2,
      vivo: true
    }
  }else{
    alert("ja tem todos os players")
  }

}


server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});