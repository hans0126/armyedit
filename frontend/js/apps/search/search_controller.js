define(function(require) {

    var app = require("app"); 

    app.controller("search_controller", [      
        "search",
        "statusAvgService",        
        "radarFactory",
        function( search, statusAvgService, radarFactory) {

            var _self = this;         

            _self.s = search;

            _self.s.init();

          

        }
    ])





})
