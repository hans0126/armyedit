define(function(require) {

    var app = require("app");



    app.controller("db_data", ["$scope", "$http", "statusAvgService",function($scope, $http,statusAvgService) {

        var _self = this;

        _self.statusAvg = statusAvgService;
    
        /*
        $scope.status_update = function() {
            $http.post("mapreduce", {
                type: "update_status"
            }).then(function(response) {
                $scope.status_data.data = response.data;
                $scope.status_data.dataTranslate();
            })

        }*/


    }])




})
