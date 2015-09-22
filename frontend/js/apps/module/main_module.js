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
    //primary module
    app.controller("m", function($scope, $location, $http) {

        $scope.go = function(path) {
            $location.path(path);
        }

        $http.post("mapreduce", {
            type: "get_status"
        }).then(function(response) {
            $scope.status_data.data = response.data;
            $scope.status_data.dataTranslate();
        })


        $http.post("getdata", {
            type: "getCategory"
        }).then(function(response) {
            var _d = response.data;
            var _re = {}
            var _map = {}

            var sort = {
                series: 0,
                faction: 1,
                category: 2
            }


            for (var i = 0; i < _d.length; i++) {
                _map[_d[i]._id] = _d[i].title;
                if (typeof(_re[_d[i].type]) == "undefined") {

                    _re[_d[i].type] = [];
                }

                _re[_d[i].type].push(_d[i]);


                _map[_d[i]._id] = {
                    title: _d[i].title,
                    type: _d[i].type,
                    sort: sort[_d[i].type],
                    _id:_d[i]._id
                };


            }

            $scope.category = _re;
            $scope.categoryMapping = _map;

            $scope.$broadcast("category complete");


        })



        $scope.status_data = {
            data: [],
            simple_data: {},
            dataTranslate: function() {
                _obj = {};
                for (var i = 0; i < this.data.length; i++) {
                    _obj[this.data[i]._id] = this.data[i].value.avg;
                }
                this.simple_data = _obj;

            }
        }


    })


    return angularAMD.bootstrap(app);



})
