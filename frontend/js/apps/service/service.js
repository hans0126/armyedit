define(function(require) {

    var app = require("app");

    app.service("statusAvgService", ['$http', function($http) {

        var _self = this;
        _self.data = []
        _self.simple_data = {}
        _self.dataTranslate = function(data) {          
            _obj = {};
            for (var i = 0; i < data.length; i++) {
                _obj[data[i]._id] = data[i].value.avg;
            }
            _self.simple_data = _obj;

        }

        _self.getData = function() {         

            $http.post("mapreduce", {
                type: "get_status"
            }).then(function(response) {
                _self.dataTranslate(response.data);
                _self.data = response.data;
            });
        }

         _self.updateData = function() {           

            $http.post("mapreduce", {
                type: "update_status"
            }).then(function(response) {
                _self.dataTranslate(response.data);
                _self.data = response.data;

                console.log(response);
            });
        }

    }])





})
