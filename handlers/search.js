var products = require('../models/products.js'),
    cards = require('../models/cards.js'),
    Q = require('q'),
    mongoose = require('mongoose');

var bodyParser = require('body-parser');

// deserializes cart items from the database

module.exports = function(req, res) {

    var _db = {
        product: products,
        card: cards
    }

    var _field = req.body.datas;

    var _tempC = ["series", "faction", "category"];
    var _self = this;
    var _query = [];
    var _dbq = {};
    var _keyword = [];
    var _nullCount = 0;
    var _collection;

    switch (_field.searchType) {
        case "product":
            _collection = "products";
            for (var i = 0; i < _tempC.length; i++) {
                if (_field[_tempC[i]] != null) {
                    _query.push(mongoose.Types.ObjectId(_field[_tempC[i]]));
                }
            }
            if (_query.length > 0) {
                _dbq.relation = {
                    $all: _query
                }
            }

            break;

        case "card":
            _collection = "cards";
            for (var i = 0; i < _tempC.length; i++) {
                if (_field[_tempC[i]] != null) {
                    var _obj = {};
                    _dbq[_tempC[i]] = mongoose.Types.ObjectId(_field[_tempC[i]]);
                }
            }

            if (_field.ability) {
                if (_field.ability.length > 0) {
                    for (var i = 0; i < _field.ability.length; i++) {
                        _field.ability[i] = mongoose.Types.ObjectId(_field.ability[i])
                    }

                    _dbq["actor.characterAbility"] = {
                        $in: _field.ability
                    }
                }
            }

            break;
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

    _db[_field.searchType].find(_dbq).sort({
        "order": 1,
        "title": 1
    }).skip(_field.pageshow * _field.currentPage).limit(_field.pageshow).exec(function(err, re) {
        if (err) throw err;
        _db[_field.searchType].find(_dbq).count(function(err, count) {
            if (err) throw err;
            // this.emit("ok", {data:re,count:count});              

            res.json(200, {
                data: re,
                count: count
            });


        })
    })


    /*categorys.find({}, function(err, re) {

        res.send(200, re);
    })*/
};
