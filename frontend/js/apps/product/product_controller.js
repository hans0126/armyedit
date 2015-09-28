define(function(require) {

    var app = require("app");

    require('d3_radar');


    app.controller("product", [
        "$scope",
        "search",
        "statusAvgService",
        "getCategoryService",
        "productDetailFactory",
        "radarFactory",
        function($scope, search, statusAvgService, getCategoryService, productDetailFactory, radarFactory) {

            var _self = this;

            var radarElement = document.getElementById("radar");

            _self.search = search;

            _self.radar = radarFactory;

            _self.radar.render(radarElement);

            _self.editCtrl = productDetailFactory;

            _self.statusAvgService = statusAvgService;

            
            //console.log(statusAvgService.simple_data);

           



            //  console.log( _self.search.selectGroup.series);

            // _self.search.selectGroup.series.data = getCategoryService.category.series;



            /*
                    

                      _self.search.selectGroup.series.data = $scope.category.category.series;
                    

                      console.log($scope.category.category.series);*/










            //search
            /*
            $scope.itemSearch = search;
            $scope.itemSearch.http = $http;
            $scope.itemSearch.scope = $scope;

            $scope.$on("category complete", function() {
                $scope.itemSearch.init($scope.category.series)
            })

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

                        $scope.currentProduct = $scope.itemSearch.returnArmy[i];

                        $scope.editCtrl.editMode(false);
                        $scope.editCtrl.mappingCategory($scope.currentProduct.relation, $scope.categoryMapping);


                        //radar
                        $scope.radar.sample_data = $scope.itemSearch.status_avg;
                        $scope.radar.data = [];
                        if (typeof($scope.currentProduct.status) != "undefined") {
                            $scope.radar.data.push($scope.radar.transferData($scope.currentProduct.status, statusAvgService.simple_data))
                        }
                        $scope.radar.render($scope.radarElement);
                    }
                }
            }

         

            */

        }
    ])





})
