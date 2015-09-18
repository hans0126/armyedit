define(function(require) {
    angularAMD = require("angularAMD");  
    var app = angular.module('myApp', ['ngRoute']);


    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', angularAMD.route({
                templateUrl: 'template/product.html',
                controller:'main',
                controllerUrl:'js/apps/controller/product_controller.js'
            })).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);


    return angularAMD.bootstrap(app);



})
