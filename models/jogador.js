const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const schema = new Schema({
  nome:{
    type: String,
    required: true
  },
  pontuacaoTotal:{
    type: Number,
    required: true
  },
  pontuacaoMaior:{
    type: Number,
    required: true
  },
  kills:{
    type: Number,
    required: true
  },
  death:{
    type: Number,
    required: true
  },
  partidasTotal:{
    type: Number,
    required: true
  },
  partidasGanhas:{
    type: Number,
    required: true}
});

module.exports = mongoose.model('Jogador',schema);