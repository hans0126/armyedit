define(function(require) {

    var app = require("app");

    require('d3_radar');


    app.controller("main", function($scope, $http, search, radar, editCtrl) {

        //search

        $scope.itemSearch = search;
        $scope.itemSearch.http = $http;
        $scope.itemSearch.scope = $scope;
        $scope.itemSearch.init();

        //edit
        $scope.editCtrl = editCtrl;


        //radar
        $scope.radar = radar;

        //current selected product
        $scope.currentProduct = null;

        $scope.getThisItem = function(id) {
            for (var i = 0; i < $scope.itemSearch.returnArmy.length; i++) {
                if ($scope.itemSearch.returnArmy[i]._id == id) {

                    if ($scope.currentProduct != null) {
                        if ($scope.currentProduct._id == id) {
                            return false;
                        }
                    }


                    $scope.editCtrl.editMode(false);
                    $scope.currentProduct = $scope.itemSearch.returnArmy[i];



                    //radar
                    $scope.radar.sample_data = $scope.itemSearch.status_avg;
                    $scope.radar.data = [];
                    if (typeof($scope.currentProduct.status) != "undefined") {
                        $scope.radar.data.push($scope.radar.transferData($scope.currentProduct.status, $scope.status_data.simple_data))
                    }
                    $scope.radar.render($scope.radarElement);
                }
            }
        }

        //save status

        $scope.saveStatus = function() {                       

            $scope.currentProduct.status = $scope.editCtrl.currentStatus;

            var _data = {
                id: $scope.currentProduct._id,
                data: $scope.editCtrl.currentStatus,
                type: "save_status"
            }

            $http.post("getData", _data).then(function(response) {

                $scope.radar.data = [];

                $scope.radar.data.push($scope.radar.transferData($scope.editCtrl.currentStatus, $scope.status_data.simple_data))

                $scope.radar.render($scope.radarElement);

                $scope.editCtrl.editMode(false);              

            })

        }

    })




})
