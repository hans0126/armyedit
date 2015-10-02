define(function(require) {

    var app = require("app");

    //primary module

    app.controller("mainCtrl", ["$scope",
        "$location",
        "getCategoryService",
        "statusAvgService",
        function($scope, $location, getCategoryService, statusAvgService) {

            var _self = this;
         

            _self.go = function(path) {
                $location.path(path);
            }

            //get status avg
            statusAvgService.getData();
            //
            getCategoryService.getData();

           // _self.category = getCategoryService;

          

        }
    ])



})
