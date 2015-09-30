define(function(require) {

    var app = require("app");

    app.factory('radarFactory', function() {

        var _orignal_data = {
            className: 'hide', // optional can be used for styling
            axes: [{
                axis: "SPD",
                value: 100,
                yOffset: -10
            }, {
                axis: "STR",
                value: 100,
                yOffset: -10,
                xOffset: -10
            }, {
                axis: "MAT",
                value: 100,
                yOffset: 10,
                xOffset: -10
            }, {
                axis: "RAT",
                value: 100,
                yOffset: 10
            }, {
                axis: "DEF",
                value: 100,
                yOffset: 10,
                xOffset: 10
            }, {
                axis: "ARM",
                value: 100,
                yOffset: -10,
                xOffset: 10
            }]
        }

        var radarTemp = {
            data: [],
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            sample_data: null,
            render: function(target) {               
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            },
            transferData: function(_data, _avg, _sample) {

                var _to = angular.copy(this.orignal_data);

                if (typeof(_sample) == "undefined") {
                    _to.className = "show";
                } else {
                    _to.className = "hide";
                }

                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        //console.log(_avg);
                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key] * _avg[key].avg;
                            break;
                        }
                    }
                }


                return _to;
            },
            init: function() {
                this.data = [];
                this.data.push(this.orignal_data);
               // this.data.push(this.orignal_data);
            }
        }

        return radarTemp;

    })

})
