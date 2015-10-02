define(function(require) {

    var app = require("app"); 

    app.controller("product", ["$scope",
        "search",
        "statusAvgService",
        "productDetailFactory",
        "radarFactory",
        function($scope, search, statusAvgService, productDetailFactory, radarFactory) {

            var _self = this;

            _self.editCtrl = productDetailFactory;
            //
            $scope.searchType = "productCategory";

             search.itemSelect = function(_obj){              
                productDetailFactory.getThisItem(_obj);
             }

            _self.statusAvgService = statusAvgService;
            
            var radarElement = document.getElementById("radar");
            radarFactory.init();
            radarFactory.render(radarElement);

        }
    ])


})
