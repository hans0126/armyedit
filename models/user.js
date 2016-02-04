var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    "provider": "String",
    "display_name": "String",
    "email": "String",
    "token_id": "String",
    "name":"String"
}, {
    collection: "user"
});

var user = mongoose.model('user', customerSchema);
module.exports = user;
