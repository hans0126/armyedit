define(function(require) {

    var app = require("app");

    app.controller("list", [
        "search",
        "statusAvgService",
        "productDetailFactory",
        "radarFactory",
        function(search, statusAvgService, productDetailFactory, radarFactory) {

            var _self = this;

            _self.search = search;

            _self.search.init();

            _self.selected = [];


            search.itemSelect = function(_obj) {

                if(_self.selected.length>=3) return false;

                var _exists = false;
                for (var i = 0; i < _self.selected.length; i++) {
                    if (_self.selected[i]._id == _obj._id) {
                        _exists = true;
                        break;
                    }
                }

                if (!_exists) {
                    _self.selected.push(_obj);

                }
            }

            _self.statusAvgService = statusAvgService;

            _self.searchBtn = {
                text: "open",
                open: false,
                trigger: function() {
                    if (this.open) {
                        this.text = "open";
                    } else {
                        this.text = "close";
                    }

                    this.open = !this.open;

                }
            }


        }
    ])


    app.directive("smallRadar", ["radarFactory", "statusAvgService", function(radarFactory, statusAvgService) {

        return {
            restrict: 'A',
            scope: {
                status: "=status"
            },
            link: function($scope, $element, $attr) {

                var _d = [];
                if (typeof($scope.status) != "undefined") {
                    _d.push(radarFactory.transferData($scope.status, statusAvgService.simple_data))
                }
                _d.push(radarFactory.orignal_data);
                RadarChart.defaultConfig.w = 150;
                RadarChart.defaultConfig.h = 150;
                RadarChart.defaultConfig.circles = false;

                RadarChart.draw($element[0], _d);



            }

        }

    }])

    app.directive("compareRadar", ["radarFactory", "statusAvgService", function(radarFactory, statusAvgService) {

        return {
            restrict: 'A',  
             scope: {
                selected: "=selected"
            },         
            link: function($scope, $element, $attr) {

               

                $scope.$watch('selected',function(){
                    console.log($scope.selected)
                })

                var _d = [];
               /* if (typeof($scope.status) != "undefined") {
                    _d.push(radarFactory.transferData($scope.status, statusAvgService.simple_data))
                }
*/
                RadarChart.defaultConfig.w = 350;
                RadarChart.defaultConfig.h = 350;

                _d.push(radarFactory.orignal_data)
                RadarChart.draw($element[0], _d);



            }

        }

    }])








})
