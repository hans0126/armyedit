var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({},{collection:"cards"});

var cards = mongoose.model('cards', customerSchema);
module.exports = cards;
