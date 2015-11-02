define(function(require) {

    var app = require("app");

    app.directive("abilityEditArea", [
        function() {
            return {
                restrict: 'A',                
                templateUrl: "js/apps/cards/directives/ability_edit_area.html"
            }

        }
    ])
})
