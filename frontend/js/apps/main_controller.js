define(function(require) {

    var app = require("app");

    require('apps/common/services/setting_service');
    require('apps/common/directives/image-onload_directive');
    //require('apps/product/product-detail_factory');
    require('apps/common/services/radar_factory');
   
    
    require('apps/common/filters/highlight_filter');
    require('apps/search/controllers/search_controller');

    //primary module

    app.controller("mainCtrl", ["$scope",
        "$location",
        "msgService",
        "settingService",
        function($scope, $location, msgService, setting) {

            var _self = this;

            setting.init();

            // _self.setting = setting;

            _self.go = function(path) {
                $location.path(path);
            }
            $scope.msg = msgService;


        }
    ])

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


    app.directive("msg", function($rootScope) {

        return {
            restrict: 'A',
            template: "<p class='{{msg.msgType}}' ><i class='fa {{msg.icon}}'></i> {{msg.msgText}}</p>",
            link: function() {

            }
        }

    })


})
