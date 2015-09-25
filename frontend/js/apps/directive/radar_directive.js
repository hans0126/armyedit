define(function(require) {

    var app = require("app");

    app.directive("radar", function() {
        return {
            link: function(scope, element) {
               // scope.radarElement = element[0];
                //scope.radar.render(element[0]);
            }
        }
    })

    app.directive("imageonload", function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    console.log("err");
                    var html = '<img src="http://fakeimg.pl/120x120/?text=img&font=lobster"/>';
                    var e = $compile(html)(scope);
                    element.replaceWith(e);
                });
            }
        };
    })

})
