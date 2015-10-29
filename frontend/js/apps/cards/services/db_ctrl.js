define(function(require) {

    var app = require("app");

    app.factory("dbCtrlFactory", ['$http', function($http) {

        var uploadOption = {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }

        function ctrl() {

            var _self = this;

            _self.inheritCard = function(_data) {

                var fd = new FormData();
                //   fd.append("datas", _data);
                for (var _key in _data) {
                    fd.append(_key, _data[_key]);
                }

                return $http.post("inherit_card", fd, uploadOption)
            }

            _self.updateCard = function(_data) {

                var fd = new FormData();

                for (var _key in _data) {
                    fd.append(_key, _data[_key]);
                }

                return $http.post("update_card", fd, uploadOption)
            }


            _self.update = function(_data, _route) {

                var fd = new FormData();

                for (var _key in _data) {
                    fd.append(_key, _data[_key]);
                }

                  return $http.post(_route, fd, uploadOption)

            }




            _self.getData = function(_id) {
                var _d = {}
                    //  _d.file = _file;
                _d.data = _id;

                return $http.post("get_card", _d)
            }

        }
        return ctrl

    }])


})
