define(function(require) {

    var app = require("app");

    //primary module

    app.controller("mainCtrl", ["$scope",
        "$location",
        "getCategoryService",
        "statusAvgService",
        function($scope, $location, getCategoryService, statusAvgService) {

            var _self = this;
            var _category = {};

            _self.go = function(path) {
                $location.path(path);
            }

            //get status avg
            statusAvgService.getData();

            getCategoryService.getData.then(function(response) {
                _category = getCategoryService.translate(response.data);

                _self.category = _category.category;
                _self.categoryMapping = _category.categoryMapping;

               // console.log( _self.category);
            });
        }
    ])



})
