define(function(require) {

    var app = require("app");

    app.filter('highlightFilter', ['$sce',  function($sce) {

        return function(_text,_key) {
          
           if (_key == null) {

                return $sce.trustAsHtml(_text);
            } else {
                var _t = _key;
                _t = _t.split(" ");

                for (var i = 0; i < _t.length; i++) {
                    _text = _text.replace(new RegExp(_t[i], 'gi'), '<span class="highlightedText">$&</span>')
                }

                 return $sce.trustAsHtml(_text);
            }

        }

    }])

})
