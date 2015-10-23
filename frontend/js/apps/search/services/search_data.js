define(function(require) {

    var app = require("app");

    app.factory("searchData", ["$http", function($http) {

        function search(_data) {
            return $http.post("/search", _data)
        }

        return search

    }])

})
