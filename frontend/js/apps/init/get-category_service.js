define(function(require) {

    var app = require("app");

    app.service("getCategoryService", ['$http', function($http) {

        var _self = this;

        _self.simpleMapping = {};

        _self['series'] = [];
        _self['faction'] = [];
        _self['productCategory'] = [];
        _self['cardCategory'] = [];


        _self.getData = function() {
            $http.post("getdata", {
                type: "getCategory"
            }).then(function(response) {
                _self.translate(response.data);
            })
        }


        _self.translate = function(re, _product) {

            var _d = re;
            var _productTemp = [];

            var sort = {
                series: 0,
                faction: 1,
                category: 2
            }

            for (var i = 0; i < _d.length; i++) {

                _self.simpleMapping[_d[i]._id] = _mapData(_d[i]);

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


            function _mapData(_obj) {
                return {
                    title: _obj.title,
                    type: _obj.type,
                    sort: sort[_obj.type],
                    _id: _obj._id
                }

            }


        }

    }])

})
