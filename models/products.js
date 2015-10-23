var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({},{collection:"products"});

var products = mongoose.model('products', customerSchema);
module.exports = products;
