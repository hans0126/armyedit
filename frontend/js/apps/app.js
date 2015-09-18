define(function(require) {

    var app = angular.module('myApp', ['ngRoute']);

    /*
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    })*/

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'template/test.html',
                controller:'main'
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);

     app.controller("main",function($scope){
        $scope.aa = "A";
    })


     return angularAMD.bootstrap(app);



})
