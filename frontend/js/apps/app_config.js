define(function(require) {


    var app = require("app");

    require('apps/main_controller');

    require('apps/common/services/setting_service');
    require('apps/common/directives/image-onload_directive');
    //require('apps/product/product-detail_factory');
    require('apps/common/services/radar_factory');
    //light box
    require('apps/common/services/lightbox_service');
    require('apps/common/directives/lightbox_directive');


    require('apps/common/filters/highlight_filter');
    require('apps/search/controllers/search_controller');
    /*search*/
    require('js/apps/search/services/search_data.js');
    require('js/apps/search/services/search_type.js');
    /*cards*/
    require('js/lib/thumbEdit/thumbEdit.js');
    require('js/apps/cards/directives/ability_edit.js');
    require('js/apps/cards/directives/ability_edit_area.js');
    require('js/apps/cards/directives/thumb_edit_board.js');
    require('js/apps/cards/directives/thumb_images_area.js');
    require('js/apps/cards/directives/custom_on_change.js');

    require('js/apps/cards/directives/warjack_editor.js');
     require('js/apps/cards/directives/warbeast_editor.js');
    require('js/apps/cards/services/db_ctrl.js');

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/product', angularAMD.route({
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
