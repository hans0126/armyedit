var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    "title": "String",
    "type": "String",
    "category": "String",
    "relation": [],
    "sort": "Number",
    "parent": "ObjectId"
}, {
    collection: "category"
});

var categorys = mongoose.model('category', customerSchema);
module.exports = categorys;
