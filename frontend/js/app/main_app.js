define(['angular', 'directive', 'controller', 'factory'], function(angular, directive, controller, factory) {

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    })


    var app = angular.module('myApp', []);

    app.controller('main', controller.main);

    app.directive('itemSelect', directive.itemSelect);
    app.directive('itemSearch', directive.itemSearch);
    app.directive('imageonload', directive.imageonload);
    app.directive('productList', ["$compile", "dataTemplates", directive.productList])
    app.directive('subContent', ["$compile", "dataTemplates", "$http", "$templateCache", "$parse", directive.subContent])

    app.directive('radar', directive.radar);


    app.factory('dataTemplates', factory.dataTemplates);

    app.controller('b', function($scope) {
        //console.log( $scope.testChange);
        $scope.apps = "a";
    })



})
