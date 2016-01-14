var products = require('../models/products.js'),
    category = require('../models/categorys.js'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var util = require('util'); //繼承object
var events = require('events'); //事件
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var im = require('imagemagick');


http.globalAgent.maxSockets = 20; //default 5


exports.parserWeb = function(req, res) {
    var _p = new parserProcess();
    _p.init();
    res.send("parserWeb");
}

exports.parserImg = function(req, res) {
    var _i = new parserImg();
    _i.init();
    res.send("parserImage");
}


function parserProcess() {}

util.inherits(parserProcess, events.EventEmitter);

parserProcess.prototype.init = function() {

    var _self = this,
        _categorys = [];

    start();
    _self.on("category loaded", getFactions)

    function start() {
        category.find(null, {
            title: 1
        }, {
            sort: {
                title: 1
            }
        }, function(err, re) {
            for (var i = 0; i < re.length; i++) {
                _categorys[re[i].title] = re[i]._id;
            }
            _self.emit("category loaded");
        })
    }

    function getFactions() {
        fs.readFile('json/factions.json', 'utf8', startParserData);
    }

    function startParserData(err, data) {

        if (err) throw err;

        var _factions = JSON.parse(data);
        var url = [];
        var _arrResult = [];
        //parser event count
        _self.eventCount = 0;
        _self.totalCount = 0;

        //save data event count
        _self.saveEventCount = 0;
        _self.saveTotalCount = 0;

        for (var key in _factions) {
            for (var i = 0; i < _factions[key].faction.length; i++) {
                for (var j = 0; j < _factions[key].class.length; j++) {
                    var _url = _factions[key].url + _factions[key].faction[i] + "/" + _factions[key].class[j];
                    _self.totalCount++;
                    parser(_url, key, _factions[key].faction[i], _factions[key].class[j]);
                }
            }
        }

        console.log(_self.totalCount);

        // when all parser complete, save to DB
        _self.on("parser complete", function(re) {
            _self.eventCount++;

            if (re.length > 0) {
                _arrResult = _arrResult.concat(re);
                console.log("p" + _arrResult.length);
            }

            if (_self.eventCount >= _self.totalCount) {
                console.log("parser complete");
                saveData(_arrResult);
            }

        });
    }

    /**
     * parser process
     * @param  url {string} 
     * @param _series {string}  warmachine / hordes
     * @param _faction {string} 
     * @param _category {string} 
     */
    function parser(url, _series, _faction, _category) {

        var _arrRelation = [];
        _arrRelation.push(_categorys[_series]);
        _arrRelation.push(_categorys[_faction]);
        _arrRelation.push(_categorys[_category]);

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
                        series: _series,
                        faction: _faction,
                        category: _category,
                        relation: _arrRelation,
                        has_img: null
                    })

                    currentCount++

                    // console.log(tt);
                    //process.exit();
                    if (parserCount == currentCount) {
                        _self.emit('parser complete', tt);
                    }

                });

            } else {
                _self.emit('parser complete', []);
            }
        });
    };


    function saveData(_arrData) {

        for (var i = 0; i < _arrData.length; i++) {
            saveProcess(_arrData[i]);
            //break;
        }
        //process count
        function saveProcess(_arr) {
            products.count({
                title: _arr.title,
                pip_code: _arr.pip_code
            }, function(err, count) {
                if (count === 0) {
                    _self.totalCount += 1;
                    // var _pdata = new products(_arrData[i]);
                    // _db.products.insert(_arr, _eventCount);

                    var _insertData = new products(_arr);
                    _insertData.save(function(err) {
                        if (err) return console.error(err);
                        console.log(_arr.title);

                    });


                }

            })
        }

    }


}



function parserImg() {}
util.inherits(parserImg, events.EventEmitter);
parserImg.prototype.init = function() {

    var _self = this;

    products.find({
        "img": {
            "$exists": false
        }
    }, {
        _id: 1,
        image_name: 1,
        img: 1
    }, function(err, re) {
        if (err) throw err

        for (var i = 0; i < re.length; i++) {
            _self.getImg(re[i]._id, re[i].image_name);
        }

    })
}



/**
 * get img to our server
 */

parserImg.prototype.getImg = function(_id, _iName) {


    var _self = this;

    _self.imgCount = 0;
    _self.currentImgCount = 0;
    _self.arrId = [];

    var _path = appDir + "\\frontend\\products\\normal\\";
    var _thumbPath = appDir + "\\frontend\\products\\thumb\\";

    var _imgUrl = "http://privateerpress.com/files/products/";   

    if (typeof(_iName) == "undefined") {

        products.find({
            _id: _id
        }, {
            image_name: 1
        }, function(err, re) {
            if (err) throw err

            var _imgName = result[0].image_name;
            var _id = result[0]._id
            _getting(_imgName, _id);

        })


    } else {
        _getting(_iName, _id);
    }

    function _getting(_img, _id) {

        var request = http.get(_imgUrl + _img, function(res) {
            console.log(res.statusCode);

            if (res.statusCode == 200) {

                _self.imgCount++;

                var imagedata = '';

                _self.arrId.push(mongoose.Types.ObjectId(_id));

                //saveImgStatus(_id);

                res.setEncoding('binary');
                res.on('data', function(chunk) {
                    imagedata += chunk;
                })

                res.on('end', function() {
                    console.log("end");

                    fs.writeFile(_path + _img, imagedata, 'binary', function(err, re) {
                        if (err) throw err

                        _self.currentImgCount++;

                        console.log(_self.imgCount + "/" + _self.currentImgCount);
                        console.log(_self.imgCount + '.File saved.' + _img);

                        im.resize({
                            srcPath: _path + _img,
                            dstPath: _thumbPath + _img,
                            width: 130,
                            quality: 1
                        }, function(err, stdout, stderr) {
                            if (err) throw err;
                            console.log('resized %s to fit within 120px', _img);
                        });


                        if (_self.currentImgCount == _self.imgCount) {
                            console.log("get complete, save to db");
                            saveImgStatus();
                        }
                    })
                })
            } else {
                console.log(res.statusCode + " / " + _img);
            }
        })
    }

    function saveImgStatus() {

        products.update({
            _id: {
                $in: _self.arrId
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
    }
}


parserImg.prototype.checkHasImg = function() {

    var _localPath = {
        'normal': 'frontend\\products\\normal\\',
        'thumb': 'frontend\\products\\thumb\\'
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
