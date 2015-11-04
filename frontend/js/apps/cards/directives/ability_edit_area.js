define(function(require) {

    var app = require("app");

    app.directive("abilityEditArea", [
        function() {
            return {
                restrict: 'A',
                link:function(scope,element,attr){
                    
                },
                templateUrl: "js/apps/cards/directives/ability_edit_area.html"
            }

        }
    ])
})
