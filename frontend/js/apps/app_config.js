define(function(require) {

    var app = require("app");

    require('apps/init/main_controller');
    require('apps/init/setting_service');

    require('apps/product/product-detail_factory');
    require('apps/product/radar_factory');   
    require('apps/directive/image-onload_directive');
    require('apps/search/search_controller');

     require('apps/filter/highlight_filter');


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
                controllerUrl: 'js/apps/db_data/db_data_controller.js'
            })).
            when('/compare', angularAMD.route({
                templateUrl: 'template/compare.html',
                controller: 'compare_controller as compare',
                controllerUrl: 'js/apps/compare/compare_controller.js'
            })).
            when('/cards', angularAMD.route({
                templateUrl: 'template/cards.html',
                controller: 'cards_controller as cards',
                controllerUrl: 'js/apps/cards/cards_controller.js'
            })).
            when('/lab', angularAMD.route({
                templateUrl: 'template/lab.html',
                controller: 'laboratory_controller as lab',
                controllerUrl: 'js/apps/lab/laboratory_controller.js'
            })).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);




})
