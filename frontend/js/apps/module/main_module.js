define(function(require) {
    angularAMD = require("angularAMD");
    var app = angular.module('myApp', ['ngRoute']);


    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', angularAMD.route({
                templateUrl: 'template/product.html',
                controller: 'main',
                controllerUrl: 'js/apps/controller/product_controller.js'
            })).
            when('/db_data', angularAMD.route({
                templateUrl: 'template/db_data.html',
                controller: 'db_data',
                controllerUrl: 'js/apps/controller/db_data_controller.js'
            })).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);

    app.controller("m", function($scope, $location,$http) {

        $scope.go = function(path) {
            $location.path(path);
        }

        $http.post("mapreduce", {
            type: "get_status"
        }).then(function(response) {
            $scope.status_data.data = response.data;  
            $scope.status_data.dataTranslate();      
        })


        $scope.status_data = {
            data :[],
            simple_data: {},
            dataTranslate: function (){
                _obj = {};
               for(var i=0;i<this.data.length; i++){
                    _obj[this.data[i]._id] = this.data[i].value.avg;
               }
               this.simple_data = _obj;
              
            }


        }


    })


    return angularAMD.bootstrap(app);



})
