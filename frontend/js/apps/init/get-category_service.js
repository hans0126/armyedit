define(function(require) {

    var app = require("app");

    app.service("getCategoryService", ['$http', function($http) {

        var _self = this;

        _self.category = [];
        _self.categoryMapping = {};

        _self.getData = $http.post("getdata", {
            type: "getCategory"
        })


        _self.translate = function(re) {

            var _d = re;
            var _re = {}
            var _map = {}

            var sort = {
                series: 0,
                faction: 1,
                category: 2
            }

            for (var i = 0; i < _d.length; i++) {
                _map[_d[i]._id] = _d[i].title;
                if (typeof(_re[_d[i].type]) == "undefined") {
                    _re[_d[i].type] = [];
                }

                _re[_d[i].type].push(_d[i]);


                _map[_d[i]._id] = {
                    title: _d[i].title,
                    type: _d[i].type,
                    sort: sort[_d[i].type],
                    _id: _d[i]._id
                }

            }

            _self.category = _re;
            _self.categoryMapping = _map;


            return {
                category:_re,
                categoryMapping:_map
            }

            //  $scope.$apply();
        }

    }])

})
