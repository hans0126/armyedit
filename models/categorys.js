var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({},{collection:"category"});

var categorys = mongoose.model('category', customerSchema);
module.exports = categorys;
