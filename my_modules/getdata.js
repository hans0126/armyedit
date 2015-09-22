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
        _product.find(_dbq).sort({
            "order": 1,
            "title": 1
        }).skip(_field.pageshow * _field.currentPage).limit(_field.pageshow).toArray(function(err, re) {



            _product.find(_dbq).count(function(err, count) {
                // this.emit("ok", {data:re,count:count});
                var status_avg = db.collection('status_avg');

                status_avg.find({}, {
                    status: 1
                }).toArray(function(err, re2) {

                    this.emit("ok", {
                        data: re,
                        count: count,
                        status_avg: re2[0].status
                    });
                }.bind(this));

            }.bind(this))


        }.bind(this))

    }.bind(this));
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
    getArmyList: getArmyList
}
