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
    var _self = this
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
                    _image_name;

                _link = "http://privateerpress.com" + $(link).find('.views-field-title .field-content a').attr('href');

                _img_path = $(link).find('.views-field-field-image-fid img').attr('src');

                _img_path = _img_path.split("/");
                _image_name = _img_path[_img_path.length - 1];

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
                    has_img: null
                })

                currentCount++

                if (parserCount == currentCount) {
                    _self.emit('parser complete', tt);
                }

            });

        } else {
            _self.emit('parser complete', []);
        }
    });


};

/**
 * save data to DB
 */
parserFaction.prototype.saveData = function(_arrData) {

    //process count

    var _self = this;

    this.eventCount = 0;
    this.totalCount = 0;

    MongoClient.connect(global.dbUrl, function(err, db) {

        var products = db.collection('products'),
            newProducts = db.collection('new_products');

        newProducts.drop(function(err) {

            for (var i = 0; i < _arrData.length; i++) {

                _saveProcee.call(_self, _arrData[i], {
                    products: products,
                    newProducts: newProducts
                });

            }

        })

    });

    _self.on("current save complete", function() {
        _self.eventCount++;

        if (_self.eventCount == _self.totalCount) {
            _self.emit("all complete");
            console.log("complete");
        }
    })

    _self.on("get img", function(msg) {
        _self.getImg(msg);
    })

    function _eventCount(err, result) {
        _self.emit("current save complete");
        // this.emit("get img", result.insertedIds[0]);
    }

    function _eventCountN(err, result) {
        _self.emit("current save complete");

    }


    function _saveProcee(_arr, _db) {
        //1. check db has the same product?
        //2. if has't,save to products DB and new products DB
        _db.products.count({
            title: _arr.title,
            pip_code: _arr.pip_code
        }, function(err, count) {
            if (count == 0) {

                _self.totalCount += 2;
                _db.products.insert(_arr, _eventCount);
                _db.newProducts.insert(_arr, _eventCountN);
            }
        });
    }
}

/**
 * get has't img from site
 */
parserFaction.prototype.getNoHasImg = function() {

    var _self = this;

    MongoClient.connect(global.dbUrl, function(err, db) {

        var products = db.collection('products');

        products.find({
            "img": null
        }, {
            _id: 1,
            image_name: 1,
            img: 1
        }).toArray(function(err, re) {
            console.log("start");
            for (var i = 0; i < re.length; i++) {
                _self.getImg(re[i]._id, re[i].image_name, re[i].img);
            }
        });

    })
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
    var _self = this;

    _self.imgCount = 0;
    _self.currentImgCount = 0;
    _self._id = [];


    var _path = "frontend\\products\\normal\\";


    var _imgUrl = "http://privateerpress.com/files/products/";


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
                getting(_imgName, _id);
            })

        })


    } else {
        getting(_iName, _id);
    }

    function getting(_img, _id) {

        http.globalAgent.maxSockets = 200; //default 5


        var request = http.get(_imgUrl + _img, function(res) {

            if (res.statusCode == 200) {

                _self.imgCount++;

                var imagedata = '';

                _self._id.push(ObjectID(_id));
                //saveImgStatus(_id);

                res.setEncoding('binary');
                res.on('data', function(chunk) {
                    imagedata += chunk;
                })

                res.on('end', function() {

                    fs.writeFile(_path + _img, imagedata, 'binary', function(err) {
                        if (err) throw err

                        _self.currentImgCount++;

                        console.log( _self.imgCount+"/"+ _self.currentImgCount);

                        console.log(_self.imgCount + '.File saved.' + _img);
                        if (_self.currentImgCount == _self.imgCount) {
                            console.log("get complete, save to db");
                            saveImgStatus();
                        }
                    })
                })
            } else {
                console.log(res.statusCode+" / "+_img);

            }
        })
    }

    function saveImgStatus() {

        MongoClient.connect(global.dbUrl, function(err, db) {

            var products = db.collection('products');

            products.update({
                _id: {
                    $in: _self._id
                }
            }, {
                $set: {
                    img: true
                }
            }, {
                multi: true
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
