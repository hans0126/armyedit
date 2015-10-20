define(function(require) {

    var app = require("app");
    
    app.factory("dbCtrlFactory", ['$http', function($http) {

        function ctrl() {
            var _self = this;

            _self.db = function(_data) {
                var fd = new FormData();
                for (var _key in _data) {
                    fd.append(_key, _data[_key]);
                }

                return $http.post("cards", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
            }

            _self.getData = function(_id, _file) {
                var _d = {}
                _d.type = "getCard";
                _d.file = _file;
                _d.data = _id;

                return $http.post("cards", _d)
            }

        }
        return ctrl

    }])


})
