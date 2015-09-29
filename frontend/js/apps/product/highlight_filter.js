define(function(require) {

    var app = require("app");

    app.filter('highlightFilter', ['$sce', 'search', function($sce, search) {

        return function(_text) {

            if (search.keyword.selected_value == null) {

                return $sce.trustAsHtml(_text);
            } else {
                var _t = search.keyword.selected_value;
                _t = _t.split(" ");

                for (var i = 0; i < _t.length; i++) {
                    _text = _text.replace(new RegExp(_t[i], 'gi'), '<span class="highlightedText">$&</span>')
                }

                 return $sce.trustAsHtml(_text);
            }

        }

    }])

})
