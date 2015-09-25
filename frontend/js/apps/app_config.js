define(function(require) {

    var app = require("app");

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', angularAMD.route({
                templateUrl: 'template/product.html',
                controller: 'product as product',
                controllerUrl: 'js/apps/product/product_controller.js'
            })).
            when('/db_data', angularAMD.route({
                templateUrl: 'template/db_data.html',
                controller: 'db_data as dbData',
                controllerUrl: 'js/apps/controller/db_data_controller.js'
            })).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);




})
