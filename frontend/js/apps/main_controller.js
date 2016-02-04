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
            $scope.login = false;

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


    app.directive("navTop", ["$compile",
        "lightBoxService",
        "settingService",
        "$location",
        function($compile, lightBoxService, settingService, $location) {

            return {
                restrict: 'A',
                scope: {
                    login: "=navTop"
                },
                link: function(scope, element, attr) {

                    scope.$watch("login", function() {
                        if (scope.login) {
                            scope.loginBtnText = "logout";
                            scope.logIcon = "fa-sign-out";
                        } else {
                            scope.loginBtnText = "login";
                            scope.logIcon = "fa-sign-in";
                        }
                    })

                    scope.dropShow = false;


                    // scope.gid=settingService.GOOGLE_CLIENT_ID;

                    // console.log($location.path());

                    scope.googleOauthUrl = combinUrl(settingService.googleOauth);


                    function combinUrl(_obj) {
                        var _temp = "";
                        var gUrl = _obj.url;

                        for (var key in _obj.parameter) {
                            _temp += "&" + key + "=" + _obj.parameter[key];
                        }

                        _temp = _temp.substr(1, _temp.length);
                        return _obj.url + _temp;
                    }



                    scope.triggerLogin = function() {
                        scope.dropShow = !scope.dropShow;
                    }
                },
                templateUrl: "js/apps/main_frame/nav_user_tpl.html"
            }
        }
    ])




})
