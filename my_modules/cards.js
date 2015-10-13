var util = require('util'); //繼承object
var events = require('events'); //事件
var mongodb = require('mongodb');
var fs = require('fs');
var gm = require('gm').subClass({
    imageMagick: true
})

var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;


function cards() {}
util.inherits(cards, events.EventEmitter);


cards.prototype.inheritCard = function(_data, _file) {
    var _self = this;
    var _d = JSON.parse(_data);

    categoryIdConvertToObjectId.call(_d);

    if (_file) {
        _d.img = uploadImage(_file);
    }

    MongoClient.connect(global.dbUrl, function(err, db) {
        var products = db.collection('products');
        var cardsDB = db.collection('cards');

        cardsDB.insert(_d, function(err, re) {
            if (err) throw err;

            if (_d.parent_id) { //has products
                products.update({
                    _id: ObjectID(_d.parent_id)
                }, {
                    $set: {
                        copy: re.insertedIds[0]
                    }
                }, function(err, re2) {
                    if (err) throw err;
                    _self.emit("save complete", re.insertedIds[0]);
                })
            } else { //new card
                _self.emit("save complete", null);
            }

        })
    })
}

cards.prototype.getCard = function(_data) {
    var _self = this;
    MongoClient.connect(global.dbUrl, function(err, db) {

        var cardsDB = db.collection('cards');

        cardsDB.find({
            _id: ObjectID(_data)
        }).toArray(function(err, re) {
            _self.emit("get data complete", re[0]);
        })
    })

}

cards.prototype.updateCard = function(_data, _file) {
    var _self = this;
    var _d = JSON.parse(_data);

    categoryIdConvertToObjectId.call(_d);


    if (_file) {
        _d.img = uploadImage(_file);
    }

    _id = _d._id;
    delete _d._id

    MongoClient.connect(global.dbUrl, function(err, db) {

        var cardsDB = db.collection('cards');
        cardsDB.update({
            _id: ObjectID(_id)
        }, _d, function(err) {
            _self.emit("update data complete");
        })

    })

}

cards.prototype.addNewCard = function(_data, _file) {
    var _self = this;

    var _d = JSON.parse(_data);

    categoryIdConvertToObjectId.call(_d);
    
    if (_file) {
        _d.img = uploadImage(_file);
    }

    MongoClient.connect(global.dbUrl, function(err, db) {
        var cardsDB = db.collection('cards');

        cardsDB.insert(_d, function(err, re) {
            if (err) throw err;
            _self.emit("add new card complete", re[0]);
        })
    })

}

function uploadImage(_file) {
    var fx = _file.originalname.split(".");
    fx = fx[fx.length - 1];
    var newFileName = new Date().getTime() + "-" + Math.floor(Math.random() * 1000) + "." + fx;

    var tmp_path = _file.path;
    var target_path = 'uploads/' + newFileName;
    var thumb_path = 'uploads/thumb/' + newFileName;

    gm(tmp_path).write(target_path, function(err) {
        if (err) throw err;
        gm(tmp_path).resize(130, 130).write(thumb_path, function(err) {
            if (err) throw err;
            // fs.unlink(tmp_path);
        })
    })

    return newFileName

}

function categoryIdConvertToObjectId() {
    var _tempC = ["series", "faction", "category"]

    for (var i = 0; i < _tempC.length; i++) {
        if (this[_tempC[i]] != null) {
            this[_tempC[i]] = ObjectID(this[_tempC[i]]);
        }
    }

    this.a = "b";

    //return _data

}


module.exports = cards
