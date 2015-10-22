define(function(require) {


    var app = require("app");

    require('apps/main_controller');

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', angularAMD.route({
                templateUrl: 'template/product.html',
                controller: 'product as product',
                controllerUrl: 'js/apps/product/product_controller.js'
            })).
            when('/statistic', angularAMD.route({
                templateUrl: 'js/apps/statistic/controllers/statistic_controller.html',
                controller: 'statistic as dbData',
                controllerUrl: 'js/apps/statistic/controllers/statistic_controller.js'
            })).
            when('/compare', angularAMD.route({
                templateUrl: 'js/apps/compare/controllers/compare_controller.html',
                controller: 'compare_controller as compare',
                controllerUrl: 'js/apps/compare/controllers/compare_controller.js'
            })).
            when('/cards', angularAMD.route({
                templateUrl: 'js/apps/cards/controllers/cards_controller.html',
                controller: 'cards_controller as cards',
                controllerUrl: 'js/apps/cards/controllers/cards_controller.js'
            })).
            when('/lab', angularAMD.route({
                templateUrl: 'js/apps/lab/controllers/laboratory_controller.html',
                controller: 'laboratory_controller as lab',
                controllerUrl: 'js/apps/lab/controllers/laboratory_controller.js'
            })).
            otherwise({
                redirectTo: '/cards'
            });
        }
    ]);


})
