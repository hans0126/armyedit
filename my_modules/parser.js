var util = require('util'); //繼承object
var events = require('events'); //事件
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongodb = require('mongodb');
var http = require('http');


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
            fs.readFile('json/factions.json', 'utf8', _startParserData.bind(this));
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

            if (re.length > 0) {
                _arrResult = _arrResult.concat(re);
                console.log("p" + _arrResult.length);
            }

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
        if (resp.statusCode == 200) {

            var tt = [];
            var $ = cheerio.load(body);

            var links = $('.views-row'); //use your CSS selector here        
            var parserCount = links.length;
            var currentCount = 0;

            $(links).each(function(i, link) {
                //http://privateerpress.com/
                //get link

                var _link,
                    _img_path,
                    _image_name,
                    subParser = new _subParser();

                _link = "http://privateerpress.com" + $(link).find('.views-field-title .field-content a').attr('href');


                _img_path = $(link).find('.views-field-field-image-fid img').attr('src');

                _img_path = _img_path.split("/");
                _image_name = _img_path[_img_path.length - 1];

                _img_path.splice(_img_path.length - 1, 1);
                _img_path = _img_path.join("/");

                console.log(_link);
                subParser.subParser(_link);

                subParser.on('sub parser ok', function(msg) {

                    tt.push({
                        image_name: _image_name,
                        title: $(link).find('.views-field-title .field-content').text(),
                        pip_code: $(link).find('.views-field-field-pip-code-value .field-content').text(),
                        fa: null,
                        pc: null,
                        series: _series,
                        faction: _faction,
                        category: _category,
                        relation: _arrRelation,
                        img: {
                            normal: null,
                            thumb: null,
                            thumb_path: _img_path,
                            normal_path: msg
                        }
                    })
                    currentCount++

                    if (parserCount == currentCount) {
                        this.emit('parser complete', tt);
                    }

                }.bind(this))

            }.bind(this));

        } else {
            this.emit('parser complete', []);
        }
    }.bind(this));


    function _subParser() {}

    util.inherits(_subParser, events.EventEmitter);

    _subParser.prototype.subParser = function(_url) {
        request(_url, function(err, resp, body) {
            console.log(resp.statusCode);
            if (resp.statusCode == 200) {
                var $ = cheerio.load(body);
                var _i = $('.field-field-image img').attr('src');
                _i = _i.split("/");
                _i.splice(_i.length - 1, 1);
                _i = _i.join("/");

                this.emit('sub parser ok', _i);
            } else {
                this.emit('sub parser ok', null);
            }

        }.bind(this))
    }



};

/**
 * save data to DB
 */
parserFaction.prototype.saveData = function(_arrData) {

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

    this.on("get img", function(msg) {
        this.getImg(msg);
    })

    function _eventCount(err, result) {
        this.emit("current save complete");
      this.emit("get img", result.insertedIds[0]);
    }

    function _eventCountN(err, result) {
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
                _db.newProducts.insert(_arr, _eventCountN.bind(this));
            }
        }.bind(this));
    }
}

/**
 * get has't img from site
 */
parserFaction.prototype.getNoHasImg = function() {
    MongoClient.connect(global.dbUrl, function(err, db) {

        var products = db.collection('products');

        products.find({
            "$or": [{
                "img.thumb": null
            }, {
                "img.normal": null
            }]

        }, {
            _id: 1,
            image_name: 1,
            img: 1
        }).toArray(function(err, re) {
            console.log("start");
            for (var i = 0; i < re.length; i++) {
                this.getImg(re[i]._id, re[i].image_name, re[i].img);
                //console.log(re[i].img);
               

            }
        }.bind(this));


    }.bind(this))
}


/**
 *   check already has img on local
 */
parserFaction.prototype.checkHasImg = function() {

    var _localPath = {
        'normal': 'frontend\\images\\army\\normal\\',
        'thumb': 'frontend\\images\\army\\thumb\\'
    };

    MongoClient.connect(global.dbUrl, function(err, db) {

        var products = db.collection('products')

        products.find({
            "img.normal": null
        }, {
            _id: 1,
            image_name: 1
        }).toArray(function(err, re) {
            for (var i = 0; i < re.length; i++) {
                //  console.log(re[i].image_name);
                for (var key in _localPath) {

                    checking(key, re[i]);

                }
            }
        });

        function checking(_key, _product) {

            fs.exists(_localPath[_key] + _product.image_name, function(exists) {
                if (exists) {
                    console.log(_product.image_name + ":" + _localPath[_key] + ":has");

                    var _query = {};
                    _query["img." + _key] = true;
                    products.update({
                        _id: ObjectID(_product._id)
                    }, {
                        $set: _query
                    }, function(err) {
                        if (err) throw err
                    })


                }
            });
        }

    });



}



/**
 * get img to our server
 */

parserFaction.prototype.getImg = function(_id, _iName, _imgUrl) {

    this.imgCount = 0;

    var _path = {
        normal: "frontend\\images\\army\\normal\\",
        thumb: "frontend\\images\\army\\thumb\\"
    }

    var _imgUrl = {
        normal: _imgUrl.normal_path,
        thumb: _imgUrl.thumb_path
    }

    if (typeof(_iName) == "undefined") {

        MongoClient.connect(global.dbUrl, function(err, db) {
            var products = db.collection('products');
            products.find({
                _id: _id
            }, {
                image_name: 1
            }).toArray(function(err, result) {
                var _imgName = result[0].image_name;
                var _id = result[0]._id

                for (var key in _imgUrl) {
                    getting.call(this, key, _imgName, _id);
                }

            }.bind(this))

        }.bind(this))

    } else {

        for (var key in _imgUrl) {
            getting.call(this, key, _iName, _id);
        }
    }

    function getting(_key, _img, _id) {

        
        var request = http.get(_imgUrl[_key] +"/"+ _img, function(res) {

            if (res.statusCode == 200) {

                saveImgStatus(_key, _id);
                var imagedata = '';
                res.setEncoding('binary');

                res.on('data', function(chunk) {
                    imagedata += chunk;
                })

                res.on('end', function() {
                    fs.writeFile(_path[_key] + _img, imagedata, 'binary', function(err) {
                        if (err) throw err

                        this.imgCount++
                        console.log(this.imgCount + '.File saved.' + _img);
                    }.bind(this))
                }.bind(this))
            } else {
                console.log(res.statusCode);
            }
        }.bind(this))
    }

    function saveImgStatus(_type, _id) {
        console.log(_id)

        var updateItem = {}
        updateItem["img." + _type] = true;

        MongoClient.connect(global.dbUrl, function(err, db) {

            var products = db.collection('products');

            products.update({
                _id: ObjectID(_id)
            }, {
                $set: updateItem
            }, function(err) {
                if (err) throw err;
                console.log("save to db");
            })

        })
    }


}


//----------------------------------------------------
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
