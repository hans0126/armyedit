define(function(require) {

    var app = require("app"); 

    app.controller("search_controller", [      
        "search",
        "statusAvgService",        
        "radarFactory",
        "getCategoryService",
        function( search, statusAvgService, radarFactory,getCategoryService) {

            var _self = this;         
            //search
            _self.s = search;

            _self.s.init();
            //category
            _self.c = getCategoryService;

        }
    ])

})
