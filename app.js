//process.env.NODE_ENV = 'production';
var express = require('express');
var path = require("path");
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



var request = require('request'),  
    cookieParser = require('cookie-parser'),
    session = require('express-session');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());

global.appRoot = path.resolve(__dirname + '/frontend/');

//body parser
app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(express.static(global.appRoot));

mongoose.connect("mongodb://localhost:27017/warmachine");

/*
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
})

app.use(morgan('combined', {
    stream: accessLogStream
}))
*/



//console.log(app.get('env'));

var route = require('./routes.js')(app);


var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
