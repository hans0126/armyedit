var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({},{collection:"ability"});

var ability = mongoose.model('ability', customerSchema);
module.exports = ability;
