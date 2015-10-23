define(function(require) {

    var app = require("app");

    app.service("settingService", ['$http', function($http) {



        var _self = this;




        //init 
        _self.init = function() {

            _self.getStatusData();
            _self.getCategoryData();
            _self.getAbilityData();
        }

        // character status value

        _self.statusValue = []; // status orignal data
        _self.statusMapping = []; // mapping by status title

        _self.getStatusData = function() {
            $http.post("get_statusAvg").then(function(response) {
                _self.statusValue = response.data;
                _self.statusMapping = _dataTranslate(response.data);                
            });
        }

        _self.updateStatusData = function() {
            $http.post("mapreduce", {
                type: "update_status"
            }).then(function(response) {
                _self.statusValue = response.data;
                _self.statusMapping = _dataTranslate(response.data);
            });
        }

        function _dataTranslate(data) {
            var _obj = {};
            for (var i = 0; i < data.length; i++) {
                _obj[data[i]._id] = data[i].value;
            }
            return _obj;
        }

        // category

        _self.categoryMapping = [];
        _self.series = [];
        _self.faction = [];
        _self.productCategory = [];
        _self.cardCategory = [];


        _self.getCategoryData = function() {

            $http.post("get_category").then(function(response) {               
                _translate(response.data);
            })

            var sort = {
                series: 0,
                faction: 1,
                category: 2
            }

            function _translate(re) {

                var _d = re;
                var _productTemp = [];

                for (var i = 0; i < _d.length; i++) {

                    _self.categoryMapping[_d[i]._id] = _mapData(_d[i]);

                    // type not category
                    if (_d[i].type != "category") {

                        _self[_d[i].type].push(_d[i]);

                    } else {

                        if (typeof(_d[i].product) == "undefined") {

                            _self['productCategory'].push(_d[i]);
                            _self['cardCategory'].push(_d[i]);

                        } else {

                            if (_d[i].product) {
                                _self['productCategory'].push(_d[i]);
                            } else {
                                _self['cardCategory'].push(_d[i]);
                            }
                        }
                    }
                }
            }

            function _mapData(_obj) {
                return {
                    title: _obj.title,
                    type: _obj.type,
                    sort: sort[_obj.type],
                    _id: _obj._id
                }

            }

        }

        //ability

        _self.abilityWeapon = [];
        _self.abilityCharacter = [];
        _self.abilityMapping = []

        _self.getAbilityData = function() {
            $http.post("get_ability").then(function(response) {
                var _d = response.data
                for (var i = 0; i < _d.length; i++) {

                    if (_d[i].type == "weapon") {
                        _self.abilityWeapon.push(_d[i])
                    } else {
                        _self.abilityCharacter.push(_d[i])
                    }

                    _self.abilityMapping[_d[i]._id] = _d[i];
                }

            });
        }

        _self.cardStatusFields = ["spd", "str", "mat", "rat", "def", "arm", "cmd", "focus", "threshold"]

        _self.lifeType = ["number", "warjack", "warbeast"];
        //_self.fieldSort = ["spd", "str", "mat", "rat", "def", "arm"];

        _self.fa = [{
            title: "Unlimit",
            brief: "u"
        }, {
            title: "Character",
            brief: "c"
        }, {
            title: "Number",
            brief: "n"
        }]

    }])

})
