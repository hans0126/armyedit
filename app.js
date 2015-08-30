var express = require('express');
var path = require("path");
var mongodb = require('mongodb');//mongodb
var assert = require('assert');//單元測試
var util = require('util');//繼承object
var events = require('events');//事件
var fs = require('fs');

var app = express();

var parser = require("./my_modules/parser.js");



app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/p', function(req, res) {
    //parse web data

    var _factions;
    fs.readFile('factions.json', 'utf8', function(err, data) {
        if (err) throw err;
        _factions = JSON.parse(data);
    });

    var url = 'http://privateerpress.com/warmachine/gallery/cygnar/warcasters';

    var myClass = new parser.parserFaction();

    myClass.on('response', function(msg) {
       this.send(msg);
    }.bind(res));

    myClass.parser(url);
    //  res.send(parserFaction(url));
    //  parserFaction(url);

    // console.log(aa);


});


app.get('/m', function(req, res) {

    // Retrieve
    var MongoClient = mongodb.MongoClient;




    // Connect to the db

    var url = 'mongodb://localhost:27017/test';
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
