var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
players.length=0
var mapa= {};


app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/telaInicial.html');
});

io.on('connection', function (socket) {
    addPlayer(socket);
    console.log('a user connected ' + players.length);

    socket.on('disconnect',() => {
      console.log('user disconnected');
      delete players[socket.id];
  });
});

function criandoMapa(){

  //Criando a matriz 
  mapa = new Array(13);
  for(var i=0;i<13;i++){
    this.mapa[i]= new Array(19);
    for(var j=0;j<19;j++){
    this.mapa[i][j]=0;
    }
  }

  //adicionando as bordas laterais do mapa 
  for(var i=0;i<13;i++){
    this.mapa[i][0]=1;
    this.mapa[i][18]=1;
  }

  //adicionando as bordas do topo e de baixo do mapa 
  for(var i=0;i<17;i++){
    this.mapa[0][i]=1;
    this.mapa[12][i]=1;
  }

  //adicionando as pedras no meio do mapa
  for(var i=0;i<5;i++){
    for(var j=0;j<8;j++){
      this.mapa[i][j]=1;
    }
  }

  //criando as caixas e definindo os PowerUps nelas
  for(var i=1;i<12;i++){
    for(var j=1;j<18;j++){
      if( this.mapa[i][j]==0 && parseInt(Math.random()*10)>1){
        let random=parseInt(Math.random()*7);
        if(random==0){
          this.mapa[i][j]=-2;
        }else if(random==1){
          this.mapa[i][j]=-3;
        }else if(random==2){
          this.mapa[i][j]=-4;
        }else{
          this.mapa[i][j]=3;          
        }
      }
    }
  }
}

function addPlayer(socket){
  //adicionando as posiçoes de cada player a medida que conectam
  if(players.length==0){
    criandoMapa();
    players.length=1;
    players[socket.id]={
      x: 78,
      y: 78,
      potencia: 1,
      num:1
    }
  }else if(players.length==1){
    players.length=2;
    players[socket.d]={
      x: 910,
      y: 598,
      potencia: 1,
      num:2
    }
  }else if(players.length==2){
    players.length=3;
    players[socket.d]={
      x: 78,
      y: 598,
      potencia: 1,
      num:2
    }
  }else if(players.length==3){
    players.length=4;
    players[socket.d]={
      x: 910,
      y: 78,
      potencia: 1,
      num:2
    }
  }else{
    alert("ja tem todos os players")
  }

}


server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});