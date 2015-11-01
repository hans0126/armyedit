define(function(require) {

   var app = require("app"); 

     app.directive("lightbox", ['lightBoxService', function(lightBoxService) {
        return {
            replace: true,
            restrict: "A",
            link: function(scope, element, atrr) {
                scope.lightbox = lightBoxService;
                lightBoxService.lightBox = angular.element(document.getElementById('lightBoxContent'));
            },
            template: "<div id='lightBox'  ng-show='lightbox.visible'><div class='overlay' ng-click='lightbox.close()'></div><div class='popup' id='lightBoxContent'>content</div></div>"

        }
    }])


})
