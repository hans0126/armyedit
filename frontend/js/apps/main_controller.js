define(function(require) {

    var app = require("app");

    //primary module

    app.controller("mainCtrl", ["$scope",
        "$location",
        "msgService",
        "settingService",    
        function($scope, $location, msgService, setting) {

            var _self = this;

            setting.init();        

            _self.go = function(path) {
                $location.path(path);
            }
            $scope.msg = msgService;
        }
    ])


    app.service('lightBoxService', ['$compile', function($compile) {
        var _self = this;
        _self.visible = true;
        _self.htmlBody = angular.element(document.getElementsByTagName('html'));
        var lightBox = angular.element(document.getElementById('lightBox'));

        _self.close = function(fn) {
            _self.visible = false;
            _self.htmlBody.removeClass('lightBoxFixed');
            if (typeof(fn) == 'function') {
                fn();
            }

            lightBox.empty();
        }

        _self.open = function(compiledObj) {
            _self.visible = false;
            _self.htmlBody.addClass('lightBoxFixed');
            if (compiledObj) {
                lightBox.append(compiledObj);
            }
        }
    }])

    app.service('ll', function() {
        this.show = false;
    })


    app.service("msgService", function($timeout) {
        var _self = this;
        var _type = ["bg-success", "bg-danger"];
        var _icon = ["fa-check", "fa-times"];

        _self.show = null;
        _self.msgType = null;
        _self.msgText = null;
        _self.timer = null;
        _self.icon = null;
        _self.showMsg = function(_text, _typeIndex) {

            _self.msgType = _type[_typeIndex];
            _self.msgText = _text;
            _self.icon = _icon[_typeIndex];
            _self.show = true;
            $timeout.cancel(_self.timer);
            _self.timer = $timeout(function() {
                _self.msgType = null;
                _self.msgText = null;
                _self.icon = null;
                _self.show = null;

            }, 3000)
        }
    })


    app.directive("lightbox", ['lightBoxService', function(lightBoxService) {
        return {
            replace: true,
            restrict: "A",
            link: function(scope, element, atrr) {
                scope.lightbox = lightBoxService;
            },
            template: "<div id='lightBox' ng-if='lightbox.visible'><div class='overlay' ng-click='lightbox.close()'></div><div class='popup'>content</div></div>"

        }
    }])


    app.directive("msg", function($rootScope) {

        return {
            restrict: 'A',
            template: "<p class='{{msg.msgType}}' ><i class='fa {{msg.icon}}'></i> {{msg.msgText}}</p>",
            link: function() {

            }
        }

    })


})
