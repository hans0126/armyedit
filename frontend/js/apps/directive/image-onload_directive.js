define(function(require) {

    var app = require("app");

  

    app.directive("imageonload", function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {           
                    var html = '<img src="http://fakeimg.pl/120x120/?text=img&font=lobster"/>';
                    var e = $compile(html)(scope);
                    element.replaceWith(e);
                });
            }
        };
    })

})
