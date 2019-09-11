var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
var mapa= {};


app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/telaInicial.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});

function criandoMapa(){
  mapa = new Array(13);
  for(var i=0;i<13;i++){
    this.mapa[i]= new Array(19);
    for(var j=0;j<19;j++){
    this.mapa[i][j]=0;
    }
  }
}


server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});