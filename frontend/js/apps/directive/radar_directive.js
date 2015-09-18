define(function(require) {

    var app = require("app");

    app.directive("radar", function() {
        return {
            link: function(scope, element) {
                scope.radarElement = element[0];
                scope.radar.render(element[0]);
            }
        }
    })

    app.directive("imageonload", function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    console.log("err");
                    var html = '<img src="http://fakeimg.pl/120x120/?text=img&font=lobster"/>';
                    var e = $compile(html)(scope);
                    element.replaceWith(e);
                });
            }
        };
    })

    app.directive("itemSelect", function() {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {

              
               //itemSelect(scope);

                element.bind('click', function() {
                  //  itemSelect.onSelect(scope,element);
                   //  scope.aaa= "B";

                   $scope.testAA();
                
                    /*
                    for (var i = 0; i < scope.itemSearch.returnArmy.length; i++) {
                        if (scope.itemSearch.returnArmy[i]._id == element.attr('_id')) {
                            // console.log(scope.currentSelectedUnit);
                            scope.$parent.currentSelectedUnit = scope.itemSearch.returnArmy[i];

                            if (typeof(scope.itemSearch.returnArmy[i].status) != "undefined") {

                                var test = {
                                    className: 'hide', // optional can be used for styling
                                    axes: [{
                                        axis: "SPD",
                                        value: scope.itemSearch.status_avg.spd * 10,
                                        yOffset: -10
                                    }, {
                                        axis: "STR",
                                        value: scope.itemSearch.status_avg.str * 10,
                                        yOffset: -10,
                                        xOffset: -10
                                    }, {
                                        axis: "MAT",
                                        value: scope.itemSearch.status_avg.mat * 10,
                                        yOffset: 10,
                                        xOffset: -10
                                    }, {
                                        axis: "RAT",
                                        value: scope.itemSearch.status_avg.rat * 10,
                                        yOffset: 10
                                    }, {
                                        axis: "DEF",
                                        value: scope.itemSearch.status_avg.def * 10,
                                        yOffset: 10,
                                        xOffset: 10
                                    }, {
                                        axis: "ARM",
                                        value: scope.itemSearch.status_avg.arm * 10,
                                        yOffset: -10,
                                        xOffset: 10
                                    }]
                                }

                                var _data = [];


                                _data.push(scope.radar.transferData(scope.itemSearch.returnArmy[i].status));
                                _data.push(test);
                                scope.radar.data = _data;

                                scope.radar.render();

                            }

                            scope.$apply();


                        }
                    }*/
                })
            },
            controller:function($scope){
                $scope.$parent.aaa= "B";
            }
        }
    })





})
