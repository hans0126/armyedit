var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    image_name: "String",
    title: "String",
    pip_code: "String",
    fa: "String",
    pc: "String",
    series: "String",
    faction: "String",
    category: "String",
    relation: ["ObjectId"],
    img: "Boolean",
    copy: "ObjectId"
}, {
    collection: "products"
});

var products = mongoose.model('products', customerSchema);
module.exports = products;
