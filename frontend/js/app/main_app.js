define(['directive', 'controller', 'factory'],function(directive,controller,factory){



  
    var app = angular.module('myApp', []);

    app.controller('main', controller.main);

    app.directive('itemSelect', directive.itemSelect);
    app.directive('itemSearch', directive.itemSearch);
    app.directive('imageonload', directive.imageonload);
    app.directive('productList', ["$compile", "dataTemplates", directive.productList])
    app.directive('selectedList', ["$compile", "dataTemplates", "$http", "$templateCache", "$parse", directive.selectedList])


    app.factory('dataTemplates', factory.dataTemplates);

    app.controller('b', function($scope) {
        //console.log( $scope.testChange);
        $scope.apps = "a";
    })


})