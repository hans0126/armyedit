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

            _self.aa = statusAvgService;

        }
    ])


    app.directive("radar", [function() {

        return {
            restrict: 'A',
            scope:{
                status:"=status"
            },
            link: function($scope, $element, $attr) {
                 console.log($scope.status);   
            }


        }

    }])





})
