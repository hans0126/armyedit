define(function(require) {

    var app = require("app");

    app.factory('radarFactory', function() {

         var statusShow = ["spd", "str", "mat", "rat", "def", "arm"];
        
        function translateData(_className, _status,settingService) {

            var _d = {
                className: _className, // optional can be used for styling
                axes: []
            };             

            for (var i = 0; i < statusShow.length; i++) {
                var _statusKey = settingService.cardStatusFields[i]
                if (_status[_statusKey] && _status[_statusKey] > -1) {

                    var _va;                 
                    _va = _status[_statusKey] * settingService.statusMapping[_statusKey].avg

                    _d.axes.push({
                        axis: _statusKey.toUpperCase(),
                        value: _va
                    })
                }
            }

            return _d
        }


        function create() {

            var _self = this;

            _self.data = [];

            _self.render = function(target) {
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            }

            _self.orignal_data = _orignal_data;

            _self.target = null;

            _self.transferData = function(_data, _avg, _className) {

                var _to = angular.copy(_self.orignal_data);
                _to.className = _className;
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
            }

            _self.init = function() {
                _self.data = [];
                _self.data.push(this.orignal_data);
                // this.data.push(this.orignal_data);
            }
        }

/*
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
            transferData: function(_data, _avg, _className) {

                var _to = angular.copy(this.orignal_data);
                _to.className = _className;
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
*/
        return translateData;

    })

})
