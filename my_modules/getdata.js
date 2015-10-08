var util = require('util'); //繼承object
var events = require('events'); //事件
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;


function getSelectData() {}
util.inherits(getSelectData, events.EventEmitter);

/**
 * @param _field{object} query
 */
getSelectData.prototype.getValue = function(_field) {
    MongoClient.connect(global.dbUrl, function(err, db) {
        var _category = db.collection('category');
        _category.find(_field, {
            "title": 1,
            "_id": 1
        }).sort({
            "order": 1,
            "title": 1
        }).toArray(function(err, re) {
            this.emit("ok", re);
        }.bind(this))

    }.bind(this));
}

function getItemList() {}
util.inherits(getItemList, events.EventEmitter);

getItemList.prototype.getData = function(_field) {

    console.log(_field);

    var _tempC = ["series", "faction", "category"]

    var _self = this;
    var _query = [];
    var _dbq = {};
    var _keyword = [];
    var _nullCount = 0;

    switch (_field.searchType) {
        case "products":

            for (var i = 0; i < _tempC.length; i++) {
                if (_field[_tempC[i]] != null) {
                    _query.push(ObjectID(_field[_tempC[i]]));
                }
            }

            break;

        case "cards":

            break;
    }

    if (_query.length > 0) {
        _dbq.relation = {
            $all: _query
        }
    }

    if (_field.keyword != null) {
        var _k = _field.keyword.split(" ");
        for (var i = 0; i < _k.length; i++) {
            _keyword.push(new RegExp(_k[i], "i"));
        }

        if (_field.keywordLogic == "and") {
            _dbq.title = {
                $all: _keyword
            }
        } else {
            _dbq.title = {
                $in: _keyword
            }
        }
    }

    MongoClient.connect(global.dbUrl, function(err, db) {

        var _product = db.collection('products');
        _product.find(_dbq).sort({
            "order": 1,
            "title": 1
        }).skip(_field.pageshow * _field.currentPage).limit(_field.pageshow).toArray(function(err, re) {

            _product.find(_dbq).count(function(err, count) {
                // this.emit("ok", {data:re,count:count});

                console.log(re);

                _self.emit("ok", {
                    data: re,
                    count: count
                });
            })
        })
    });

}


getSelectData.prototype.getCategory = function() {

    var _self = this;
    MongoClient.connect(global.dbUrl, function(err, db) {
        var category = db.collection('category');
        category.find().toArray(function(err, re) {
            _self.emit("category get complete", re)
        })

    })

}


module.exports = {
    getSelect: getSelectData,
    getItemList: getItemList
}
