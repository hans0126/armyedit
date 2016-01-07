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




exports.parserWeb = function(req, res) {

    var _p = new parserProcess();
    _p.init();



    res.send("A1");

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

        _self.eventCount = 0;
        _self.totalCount = 0;

        for (var key in _factions) {
            for (var i = 0; i < _factions[key].faction.length; i++) {
                for (var j = 0; j < _factions[key].class.length; j++) {
                    var _url = _factions[key].url + _factions[key].faction[i] + "/" + _factions[key].class[j];
                    _self.totalCount++;
                    parser(_url, key, _factions[key].faction[i], _factions[key].class[j]);

                    break
                }
                break
            }
            break
        }

        console.log(_self.totalCount);

        // wher all parser complete, save to DB

        /*
        _self.on("parser complete", function(re) {
            _self.eventCount++;

            if (re.length > 0) {
                _arrResult = _arrResult.concat(re);
                console.log("p" + _arrResult.length);
            }

            if (_self.eventCount >= _self.totalCount) {
                console.log("parser complete");
                _self.saveData(_arrResult);

            }

        }.bind(this));
        */

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

                    console.log(tt);
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


}
