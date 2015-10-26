//process.env.NODE_ENV = 'production';
var express = require('express');
var path = require("path");
var mongodb = require('mongodb'); //mongodb
var assert = require('assert'); //單元測試
var util = require('util'); //繼承object
var events = require('events'); //事件
var fs = require('fs');
var http = require('http');
var morgan = require('morgan') //record 

var multer = require('multer')

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var upload = multer({
    dest: './upload_temp/'
});

var app = express();

mongoose.connect("mongodb://localhost:27017/warmachine");




//console.log(route);

var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
})

app.use(morgan('combined', {
    stream: accessLogStream
}))

//app.use(multer({ dest: './uploads/'}));

global.dbUrl = "mongodb://localhost:27017/warmachine";
global.appRoot = path.resolve(__dirname + '/frontend/');

//global.dbUrl ="mongodb://hans0126:a0955587777@ds039484.mongolab.com:39484/ttt"

//console.log(app.get('env'));

//body parser
app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(express.static(global.appRoot));


var route = require('./routes.js')(app);



/*
app.post('/cards', upload.single('file'), function(req, res) {

  

    var cards = require("./my_modules/cards.js");
    cards = new cards();

    switch (req.body.type) {
        case "inheritCard":
            cards.inheritCard(req.body.datas, req.file);
            cards.on("save complete", function(msg) {
                res.send(msg, 200);
            })
            break;

        case "getCard":
            cards.getCard(req.body.data);
            cards.on("get data complete", function(msg) {
                res.send(msg, 200);
            })
            break;

        case "updateCard":
            cards.updateCard(req.body.datas, req.file);
            cards.on("update data complete", function() {
                res.send("update ok", 200);
            })
            break;

        case "addNew":

            cards.addNewCard(req.body.datas, req.file);

            cards.on("add new card complete", function() {
                res.send("update ok", 200);
            })
            break;


    }
})

*/
app.get('/p', function(req, res) {
    //parse web data
    var parser = require("./my_modules/parser.js");
    var pF = new parser.parserFaction();



    //pF.startParser();
    //pF.checkHasImg();
    //pF.getNoHasImg();
    /*
        pF.on("all complete", function() {
            console.log("parse end")
        })
    */
    /*
        pF.on("save complete", function() {
            console.log("this ok");
        })
    */

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


app.get('/getImg', function(req, res) {
    var parser = require("./my_modules/parser.js");
    var pF = new parser.parserFaction();
    pF.getImg("33088_KommanderHarkevichWEB.jpg");
    res.send("A");

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
