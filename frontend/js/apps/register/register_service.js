define(function(require) {

    var app = require("app");

    app.service("registerService", ['$http', function($http) {

        var _self = this;

        _self.tokenInfo = null


        _self.getToken = function(fn) {
            $http.post("front_get_token").then(function(response) {
                _self.tokenInfo = response.data;

                if (typeof(fn) === "function") {
                    fn(_self.tokenInfo);
                }

            });
        }

         _self.userUpdate = function(_data,fn) {
            $http.post("/user_update",_data).then(function(response) {
              

                if (typeof(fn) === "function") {
                    fn();
                }

            });
        }


    }])

})
