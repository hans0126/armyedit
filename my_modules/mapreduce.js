var util = require('util'); //繼承object
var events = require('events'); //事件
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;


function reduce() {}
util.inherits(reduce, events.EventEmitter);

reduce.prototype.status_avg = function(_field) {

    var _self = this;

    MongoClient.connect(global.dbUrl, function(err, db) {
        var products = db.collection('products');
        var temp_collection = db.collection('temp_collection');

        //map
        function _map() {
            for(var key in this.status){
                emit(key, this.status[key]);
            }

           // emit(this.status_key, this.status_value);
        }
        //reduce
        function _reduce(_key, _values) {
            var _max = _values.sort(function(a, b) {
                return b - a
            })[0];

            var _min = _values.sort(function(a, b) {
                return a - b
            })[0];

            var _avg = Math.floor(100 / _max) // parseInt((100 / _max).toFixed(2));

            var _ob = {
                max: _max,
                min: _min,
                avg: _avg
            }

            return _ob;

        }
        //finalize
        var _query = {
            out: "status_range_value"
        }

        products.mapReduce(_map, _reduce, _query, function(err, re) {
            if (err) throw err;

            _self.emit("status avg ok");

            //temp_collection.drop();

        })
        
    });
}


reduce.prototype.get_status = function() {
    var _self = this;
    MongoClient.connect(global.dbUrl, function(err, db) {
        var status_range_value = db.collection('status_range_value');
        status_range_value.find().toArray(function(err, re) {
            if (err) throw err;

            _self.emit("get status data", re);

        })
    })
}



module.exports = {
    reduce: reduce

}
