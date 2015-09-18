define(function(require) {

   /* require("angularRoute");

    require("directive",function(){
        console.log("A");
    })*/
   // 'directive','controller','factory'
   
    directive = require('directive');
    controller = require('controller');



    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    })



    var app = angular.module('myApp', ['ngRoute']);


    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'template/main.html'
            }).
            when('/test', {
                templateUrl: 'template/test.html'
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);

    app.controller('main', controller.main);


    app.controller('sub', function($scope) {
        console.log($scope.ChangeArea);
    });


    app.directive('itemSelect', directive.itemSelect);
    app.directive('itemSearch', directive.itemSearch);
    app.directive('imageonload', directive.imageonload);
    app.directive('productList', ["$compile", "dataTemplates", directive.productList])
    app.directive('subContent', ["$compile", "dataTemplates", "$http", "$templateCache", "$parse", directive.subContent])

    app.directive('radar', directive.radar);
    app.directive('detailStatus', directive.detailStatus);

    factory = require('factory');
    app.factory('dataTemplates', factory.dataTemplates);


   


})
