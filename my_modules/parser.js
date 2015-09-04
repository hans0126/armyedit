var util = require('util'); //繼承object
var events = require('events'); //事件
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongodb = require('mongodb');


var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

function parserFaction() {



}
util.inherits(parserFaction, events.EventEmitter);




parserFaction.prototype.startParser = function() {

    MongoClient.connect(global.dbUrl, _getCategory2Array.bind(this));
    // when category data loaded 
    this.on('category loaded', function(re) {
            this.category = re;
            // get faction datas 
            // when loaded, parser start!!
            fs.readFile('factions.json', 'utf8', _startParserData.bind(this));
        })
        /**
         * get category data,conver to array
         */
    function _getCategory2Array(err, db) {

        var _category = db.collection('category');
        _category.find({}, {
            title: 1
        }).sort({
            title: 1
        }).toArray(function(err, re) {
            var _arrReturn = [];
            for (var i = 0; i < re.length; i++) {
                _arrReturn[re[i].title] = re[i]._id;
            }

            this.emit('category loaded', _arrReturn);

        }.bind(this))
    }
    /**
     *  parser process
     */
    function _startParserData(err, data) {

        if (err) throw err;

        var _factions = JSON.parse(data);
        var url = [];
        var _arrResult = [];

        this.eventCount = 0;
        this.totalCount = 0;

        for (var key in _factions) {
            for (var i = 0; i < _factions[key].faction.length; i++) {
                for (var j = 0; j < _factions[key].class.length; j++) {
                    var _url = _factions[key].url + _factions[key].faction[i] + "/" + _factions[key].class[j];
                    this.parser(_url, key, _factions[key].faction[i], _factions[key].class[j]);
                    this.totalCount++;
                }
            }
        }
        // wher all parser complete, save to DB
        this.on("parser complete", function(re) {
            this.eventCount++;
            _arrResult = _arrResult.concat(re);
            console.log("p" + _arrResult.length);

            if (this.eventCount >= this.totalCount) {

                console.log("parser complete");
                this.saveData(_arrResult);

            }

        }.bind(this));

    }



}

/**
 * parser process
 * @param  url {string} 
 * @param _series {string}  warmachine / hordes
 * @param _faction {string} 
 * @param _category {string} 
 */
parserFaction.prototype.parser = function(url, _series, _faction, _category) {

    var _arrRelation = [];
    _arrRelation.push(this.category[_series]);
    _arrRelation.push(this.category[_faction]);
    _arrRelation.push(this.category[_category]);

    //url = "http://privateerpress.com/warmachine/gallery/cygnar/warcasters";
    request(url, function(err, resp, body) {
        var tt = [];
        $ = cheerio.load(body);

        links = $('.views-row'); //use your CSS selector here        

        $(links).each(function(i, link) {
            var _img = $(link).find('.views-field-field-image-fid img').attr('src');
            _img = _img.split("/");
            _img = _img[_img.length - 1];

            tt.push({
                img: _img,
                title: $(link).find('.views-field-title .field-content').text(),
                pip_code: $(link).find('.views-field-field-pip-code-value .field-content').text(),
                fa: null,
                pc: null,
                series: _series,
                faction: _faction,
                category: _category,
                relation: _arrRelation
            })

        });

        this.emit('parser complete', tt);

    }.bind(this));

};

/**
 * save data to DB
 */
parserFaction.prototype.saveData = function(_arrData) {
    console.log(_arrData.length);
    //process count
    this.eventCount = 0;
    this.totalCount = 0;

    MongoClient.connect(global.dbUrl, function(err, db) {

        var products = db.collection('products'),
            newProducts = db.collection('new_products');

        newProducts.drop(function(err) {

            for (var i = 0; i < _arrData.length; i++) {

                _saveProcee.call(this, _arrData[i], {
                    products: products,
                    newProducts: newProducts
                });

            }

        }.bind(this))

    }.bind(this));

    this.on("current save complete", function() {
        this.eventCount++;

        if (this.eventCount == this.totalCount) {
            this.emit("all complete");
            console.log("complete");
        }
    })

    function _eventCount(err, result) {
        this.emit("current save complete");
    }

    function _saveProcee(_arr, _db) {
        //1. check db has the same product?
        //2. if has't,save to products DB and new products DB
        _db.products.count({
            title: _arr.title,
            pip_code: _arr.pip_code
        }, function(err, count) {
            if (count == 0) {
                this.totalCount += 2;
                _db.products.insert(_arr, _eventCount.bind(this));
                _db.newProducts.insert(_arr, _eventCount.bind(this));
            }
        }.bind(this));
    }
}


function createCategory2DB() {}
util.inherits(createCategory2DB, events.EventEmitter);

createCategory2DB.prototype.start = function() {

    this.eventCount = 0;
    this.totalCount = 0;

    MongoClient.connect(global.dbUrl, function(err, db) {

        var category = db.collection('category');

        fs.readFile('factions.json', 'utf8', function(err, data) {
            if (err) throw err;

            var _factions = JSON.parse(data);

            for (var key in _factions) {
                this.totalCount++;

                category.insert({
                        title: key,
                        type: "series"
                    }, function(err, result) {
                        var series_id = result.insertedIds[0];

                        for (var i = 0; i < _factions[this.key].faction.length; i++) {
                            this.obj.totalCount++;
                            category.insert({
                                title: _factions[this.key].faction[i],
                                parent: series_id,
                                type: "faction"
                            }, _eventCount.call(this.obj))
                        }

                        _eventCount.call(this.obj);

                    }.bind({
                        obj: this,
                        key: key
                    }))
                    /**/
                for (var j = 0; j < _factions[key].class.length; j++) {
                    this.totalCount++;
                    category.insert({
                        title: _factions[key].class[j],
                        type: "category"
                    }, _eventCount.call(this))
                }
            }
        }.bind(this))
    }.bind(this))

    function _eventCount(err, result) {

        this.eventCount++;
        console.log(this.eventCount + "/" + this.totalCount);
        if (this.eventCount == this.totalCount) {
            // this.emit("save complete");
            console.log("create ok");
            this.removeDuplicate();
        }
    }

}


createCategory2DB.prototype.removeDuplicate = function() {
    MongoClient.connect(global.dbUrl, function(err, db) {
        var category = db.collection('category');

        category.aggregate([{
            $group: {
                _id: "$title"
            }
        }], function(err, re) {
            if (err) console.log(err);

            for (var i = 0; i < re.length; i++) {

                //  category.find({title:re[i]._id}).toArray()

                category.aggregate([{
                    $match: {
                        title: re[i]._id
                    }
                }, {
                    $sort: {
                        _id: 1
                    }

                }], function(err, _re) {
                    for (var j = 1; j < _re.length; j++) {
                        /*var objectId = new ObjectID(_re[j]._id);   
                         console.log(objectId.getTimestamp().toString());*/
                        category.deleteOne({
                            _id: _re[j]._id
                        }, function(err, result) {
                            if (err) console.log(err);

                        });
                    }
                })
            }
        })
    })
}

module.exports = {
    parserFaction: parserFaction,
    createCategory2DB: createCategory2DB
}
