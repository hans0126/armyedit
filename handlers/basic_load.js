var categorys = require('../models/categorys.js'),
    ability = require('../models/ability.js'),
    statusAvg = require('../models/status_avg.js'),
    Q = require('q')

// deserializes cart items from the database

exports.getCategory = function(req, res) {
    categorys.find({}, function(err, re) {

         res.json(200, re);
    })
};


exports.getAbility = function(req, res) {
    ability.find({}, function(err, re) {
         res.json(200, re);
    })
};

exports.getStatusAvg = function(req, res) {
    statusAvg.find({}, {
        "value.sort": 0
    }).sort({
        "value.sort": 1
    }).exec(function(err, re) {
         res.json(200, re);
    })


};
