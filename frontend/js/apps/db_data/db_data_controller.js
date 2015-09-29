define(function(require) {

    var app = require("app");



    app.controller("db_data", ["$scope", "$http", "statusAvgService", function($scope, $http, statusAvgService) {

        var _self = this;

        _self.statusAvg = statusAvgService;

    }])




})
