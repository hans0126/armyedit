define(function(require) {

    var app = require("app"); 

    app.controller("product", [      
        "search",
        "statusAvgService",
        "productDetailFactory",
        "radarFactory",
        function( search, statusAvgService, productDetailFactory, radarFactory) {

            var _self = this;

             _self.editCtrl = productDetailFactory;

             search.itemSelect = function(_obj){
              
                productDetailFactory.getThisItem(_obj);
             }

            var radarElement = document.getElementById("radar");    

            _self.statusAvgService = statusAvgService;

            var radar = radarFactory;
            var radarElement = document.getElementById("radar");
            radar.render(radarElement);

        }
    ])





})
