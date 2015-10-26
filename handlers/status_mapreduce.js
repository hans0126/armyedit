var cards = require('../models/cards.js'),
    statusAvg = require('../models/status_avg.js');


module.exports = function(req, res) {
    var _o = {}

    //map
    _o.map = function() {
        for (var i = 0; i < this.actor.length; i++) {
            for (var key in this.actor[i].status) {
                emit(key, this.actor[i].status[key]);
            }
        }
    }

    //reduce
    _o.reduce = function(_key, _values) {

        var fieldSort = {
            spd: 0,
            str: 1,
            mat: 2,
            rat: 3,
            def: 4,
            arm: 5,
            cmd: 6,
            focus: 7,
            threshold: 8
        }

        var _max = _values.sort(function(a, b) {
            return b - a
        })[0];


        //if has null ?

        var _arr_min = _values.sort(function(a, b) {
            return a - b
        });

        _min = getMinValue(_arr_min);

        function getMinValue(_arr, _idx) {

            var _r, _i;

            _i = _idx;

            if (!_i) {
                _i = 0;
            }

            _r = _arr[_i];

            if (!_r && _i < _arr.length - 1) {
                _i++;
                _r = getMinValue(_arr, _i);
            }

            return _r;
        }

        var _avg = Math.floor(100 / _max) // parseInt((100 / _max).toFixed(2));

        var sort = 99;

        if (typeof(fieldSort[_key] != "undefined")) {
            sort = fieldSort[_key];
        }

        var _ob = {
            max: _max,
            min: _min,
            avg: _avg,
            sort: sort
        }

        return _ob;

    }

    //finalize
    _o.out = "status_range_value";

    cards.mapReduce(_o, function(err, model, stats) {
        console.log('map reduce took %d ms', stats.processtime)
        statusAvg.find({}, {
            "value.sort": 0
        }).sort({
            "value.sort": 1
        }).exec(function(err, re) {
            res.json(200, re);
        });
    })


};
