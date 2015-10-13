var express = require('express');
var path = require("path");
var mongodb = require('mongodb'); //mongodb
var assert = require('assert'); //單元測試
var util = require('util'); //繼承object
var events = require('events'); //事件
var fs = require('fs');
var http = require('http');




var multer = require('multer')
var upload = multer({
    dest: './upload_temp/'
});

var app = express();

//app.use(multer({ dest: './uploads/'}));

global.dbUrl = "mongodb://localhost:27017/warmachine";

var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
//body parser


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

global.appRoot = path.resolve(__dirname + '/frontend/');

app.use(express.static(global.appRoot));

app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/frontend/index.html'));
    res.sendFile(global.appRoot + '/index.html');
});




app.post('/getData', function(req, res) {

    var getData = require("./my_modules/getdata.js");
    var saveData = require("./my_modules/savedata.js");
    var getSelectData = new getData.getSelect();
    var save = new saveData.saveData();

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

            var getItemList = new getData.getItemList();

            getItemList.getData(req.body.datas);

            getItemList.on("ok", function(re) {
                res.send(re, 200);
            })

            break;

        case "save_status":
            save.saveSingle(req.body);

            save.on("save ok", function() {
                res.send(JSON.stringify({
                    result: "ok"
                }), 200)
            })


            break;

        case "getCategory":

            getSelectData.getCategory();
            getSelectData.on('category get complete', function(re) {
                res.send(re, 200);
            })

            break;

        case "get_ability":

            var getAbility = new getData.getAbility();
            getAbility.getData();
            getAbility.on('ability load complete', function(re) {
                res.send(re, 200);
            })

            break;



    }

});

app.post('/mapreduce', function(req, res) {

    var reduce_module = require("./my_modules/mapreduce.js");

    var reduce = new reduce_module.reduce();

    //  reduce.status_avg();

    switch (req.body.type) {
        case "get_status":
            reduce.get_status();
            reduce.on('get status data', function(arr) {
                res.send(arr, 200);
            })

            break;

        case "update_status":
            reduce.status_avg();
            reduce.on("status avg ok", function() {
                reduce.get_status();
            })
            reduce.on('get status data', function(arr) {
                res.send(arr, 200);
            })

            break;
    }

    // res.send("a", 200);
})




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


app.get('/p', function(req, res) {
    //parse web data
    var parser = require("./my_modules/parser.js");
    var pF = new parser.parserFaction();



    // pF.startParser();
    //pF.checkHasImg();
    //pF.getNoHasImg();
    /*
    pF.on("save complete", function() {
        console.log("this ok");
    })*/

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
