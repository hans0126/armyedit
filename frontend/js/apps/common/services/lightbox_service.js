define(function(require) {

    var app = require("app");

    app.service('lightBoxService', ['$window', function($window) {
        var _self = this;
        _self.visible = false;
        _self.htmlBody = angular.element(document.getElementsByTagName('html'));
        _self.lightBox = null;
        _self.onCloseFn;

        _self.close = function() {
            _self.visible = false;
            _self.htmlBody.removeClass('lightBoxFixed');

            if (typeof(_self.onCloseFn) == 'function') {
                _self.onCloseFn();
            }
            _self.lightBox.empty();
        }

        _self.open = function(compiledObj, w, h) {

            if (compiledObj) {

                var _x,
                    _y,
                    _w = w,
                    _h = h;

                if (!_w || !_h) {
                    _w = 400;
                    _h = 400;
                }

                _x = $window.innerWidth / 2 - _w / 2;
                _y = $window.innerHeight / 2 - _h / 2;

                _self.visible = true;
                _self.htmlBody.addClass('lightBoxFixed');
                _self.lightBox.append(compiledObj);

                _self.lightBox.css({
                    top: _y + "px",
                    left: _x + "px"
                })

            }
        }
    }])

})
