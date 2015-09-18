define(function(require) {

    var app = require("app");

    require('d3_radar');


    app.controller("testRadar", function($scope) {

        var _data = []

        var _orignal_data = {
            className: 'germany', // optional can be used for styling
            axes: [{
                axis: "SPD",
                value: 1,
                yOffset: -10
            }, {
                axis: "STR",
                value: 1,
                yOffset: -10,
                xOffset: -10
            }, {
                axis: "MAT",
                value: 0,
                yOffset: 10,
                xOffset: -10
            }, {
                axis: "RAT",
                value: 0,
                yOffset: 10
            }, {
                axis: "DEF",
                value: 0,
                yOffset: 10,
                xOffset: 10
            }, {
                axis: "ARM",
                value: 0,
                yOffset: -10,
                xOffset: 10
            }]
        }

        _data.push(_orignal_data);

        $scope.radarTemp = {
            data: _data,
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            render: function(target) {
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            },
            transferData: function(_data) {

                var _to = angular.copy(this.orignal_data);

                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key];
                            break;
                        }
                    }
                }
                return _to;
            }
        }

        // console.log($scope.aaa);


        $scope.clickTest = function() {
            console.log($scope.aaa);
            //radarTemp.render($scope.radarElement);


        }



    })




})
