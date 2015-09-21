define(function(require) {

    var app = require("app");



    app.controller("db_data", function($scope, $http) {




        $scope.status_update = function() {
            $http.post("mapreduce", {
                type: "update_status"
            }).then(function(response) {
                $scope.status_data.data = response.data;
                $scope.status_data.dataTranslate();
            })

        }


    })




})
