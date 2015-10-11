define(function(require) {

    var app = require("app");

    //primary module

    app.controller("mainCtrl", ["$scope",
        "$location",
        "getCategoryService",
        "statusAvgService",
        function($scope, $location, getCategoryService, statusAvgService) {

            var _self = this;


            _self.go = function(path) {
                $location.path(path);
            }

            //get status avg
            statusAvgService.getData();
            //
            getCategoryService.getData();

            // _self.category = getCategoryService;

            $scope.msg = {
                text: null,
                type: null
            }

            $scope.showMsg = false;

            $scope.addMsg = function(_text, _typeIndex) {

                var _type = ["bg-success", "bg-danger"];
                $scope.msg = {
                    text: _text,
                    type: _type[_typeIndex]
                }
            }


        }
    ])

    app.directive("msg", function($timeout) {

        return {
            restrict: 'A',
            link: function(scope, element, attr) {

                var timer;

                scope.$watch('msg', function() {
                    if (scope.msg.text) {
                        $timeout.cancel(timer);
                        scope.showMsg = true;
                        
                        timer = $timeout(function() {
                            scope.showMsg = false;
                            scope.msg = {
                                text: null,
                                type: null
                            }
                        }, 5000)
    
                      
                      /*  timer.then(
                            function() {
                                console.log("Timer resolved!", Date.now());
                            },
                            function() {
                                console.log("Timer rejected!", Date.now());
                            }
                        );

                        */
                    }
                })

            },
            template: "<p class='{{msg.type}}' ng-if='showMsg'>{{msg.text}}</p>"
        }

    })






})
