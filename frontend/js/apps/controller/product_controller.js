define(function(require) {

    var app = require("app");

    require('d3_radar');


    app.controller("main", function($scope, $http, search, radar) {

        //search

        $scope.itemSearch = search;
        $scope.itemSearch.http = $http;
        $scope.itemSearch.scope = $scope;
        $scope.itemSearch.init();


        $scope.editCtrl = {
            numShow: 'show_inline',
            inputShow: 'hide'
        }

        //radar
        $scope.radar = radar;

        $scope.aaa = "A";

        //current selected product
        $scope.currentProduct = "A";

        $scope.testAA = function() {
            console.log("B");
            $scope.currentProduct = "B"
        }


        /*  
                $scope.$watch('currentProduct',function(){
                    console.log("AA");
                })*/


        /* var listener = $scope.$watch('radarElement', function() {
             $scope.radarTemp.render($scope.radarElement);
         })
         */




    })




})
