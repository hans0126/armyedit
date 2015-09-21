var util = require('util'); //繼承object
var events = require('events'); //事件
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;


function saveData() {}
util.inherits(saveData, events.EventEmitter);

saveData.prototype.saveSingle = function(_field) {
    MongoClient.connect(global.dbUrl, function(err, db) {
        var products = db.collection('products');     

        var _d = {};
        for(key in _field.data){
            _d["status."+key] = _field.data[key];
        }

        products.update({_id:ObjectID(_field.id)},{$set:_d},function(err,re){
            this.emit("save ok");
       
        }.bind(this));
      
    }.bind(this));
}



module.exports = {
    saveData: saveData,
   
}
