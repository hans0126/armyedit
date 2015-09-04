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

function getArmyList() {}
util.inherits(getArmyList, events.EventEmitter);

getArmyList.prototype.getData = function(_field) {

    var _query = [];
    var _dbq = {};
    var _keyword = [];
    var _nullCount = 0;

    for (var i = 0; i < _field.field.length; i++) {
        if (_field.field[i] != null) {
            _query.push(ObjectID(_field.field[i]));
        } else {
            _nullCount++;
        }
    }

    if (_nullCount < _field.field.length) {
        _dbq.relation = {
            $all: _query
        }
    }

    if (_field.keyword != null) {
        var _k = _field.keyword.split(" ");
        for (var i = 0; i < _k.length; i++) {
            _keyword.push(new RegExp(_k[i], "i"));
        }

        _dbq.title = {
            $all: _keyword
        }
    }

    MongoClient.connect(global.dbUrl, function(err, db) {

        var _product = db.collection('products');
        _product.find(_dbq, {relation:0}).sort({
            "order": 1,
            "title": 1
        }).skip(_field.pageshow*_field.currentPage).limit(_field.pageshow).toArray(function(err, re) {
            this.emit("ok", re);
        }.bind(this))

    }.bind(this));
}



module.exports = {
    getSelect: getSelectData,
    getArmyList: getArmyList
}
