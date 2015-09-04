var express = require('express');
var path = require("path");
var mongodb = require('mongodb'); //mongodb
var assert = require('assert'); //單元測試
var util = require('util'); //繼承object
var events = require('events'); //事件
var fs = require('fs');

var app = express();

global.dbUrl = "mongodb://localhost:27017/warmachine";

var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies




global.appRoot = path.resolve(__dirname+'/frontend/');

app.use(express.static(global.appRoot));

app.get('/', function(req, res) {
   // res.sendFile(path.join(__dirname + '/frontend/index.html'));
   res.sendFile(global.appRoot +'/index.html');
});

app.post('/getData', function(req, res) {

    var getData = require("./my_modules/getdata.js");
    var getSelectData = new getData.getSelect();

    switch (req.body.type) {
        case "series":
            getSelectData.getValue({
                "type": "series"
            })

            getSelectData.on("ok", function(re) {
                res.send(re, 200);
            })

            break;

        case "faction":

            getSelectData.getValue({
                "type": "faction",
                "parent": ObjectId(req.body.id)
            })
            getSelectData.on("ok", function(re) {
                res.send(re, 200);
            })

            break;
        case "category":

            getSelectData.getValue({
                "type": "category",
                "relation": {
                    "$in": [ObjectId(req.body.id)]
                }
            })

            getSelectData.on("ok", function(re) {
                res.send(re, 200);
            })
            break;
        case "search":

            var getArmyList = new getData.getArmyList();

            getArmyList.getData({
                field: [
                    req.body.series,
                    req.body.faction,
                    req.body.category
                ],
                keyword:req.body.keyword,
                currentPage:req.body.currentPage,
                pageshow:req.body.pageshow
            });
        

            getArmyList.on("ok", function(re) {
                res.send(re, 200);
            })

            break;

    }

});



app.get('/p', function(req, res) {
    //parse web data
    var parser = require("./my_modules/parser.js");
    var pF = new parser.parserFaction();

    pF.startParser();

    pF.on("save complete", function() {
        console.log("this ok");
    })

    /*var ca = new parser.createCategory2DB();
    ca.start();*/

    res.send("ok");

});


app.get('/i', function(req, res) {
    var getter = require("pixel-getter");
    //get pixel info
    getter.get("test.png", function(err, pixels) {
        console.log(pixels[0].length);

    });

})

app.get('/m', function(req, res) {

    // Retrieve
    var MongoClient = mongodb.MongoClient;




    // Connect to the db

    var url = 'mongodb://localhost:27017/warmachine';
    res.send("A");

    MongoClient.connect(url, function(err, db) {

        assert.ok(false, 'this is error');
        //     insertDocuments(db,function(){
        //       console.log("A");

        //   })  

        /*
                console.log("Connected correctly to server");

                var collection = db.collection('user');

               collection.insert([{
                    a: 1
                }, {
                    a: 2
                }, {
                    a: 3
                }], function(err, result) {         
                    console.log("Inserted 3 documents into the document collection");

                   
                   // callback(result);
                });

             


                db.close();
        */

    });

})


function parserFaction() {




    //  console.log(tt);


}

util.inherits(parserFaction, events.EventEmitter);

parserFaction.prototype.parser = function() {

    var request = require('request'),
        cheerio = require('cheerio'),
        url = "http://privateerpress.com/warmachine/gallery/cygnar/warcasters";


    request(url, function(err, resp, body) {
        var tt = '';
        $ = cheerio.load(body);

        links = $('.views-row'); //use your CSS selector here        

        $(links).each(function(i, link) {
            tt += $(link).find('.views-field-field-image-fid img').attr('src');

        });


        this.emit('response', tt);
    }.bind(this));

};


var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
