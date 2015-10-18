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

            // _self.setting = setting;

            _self.go = function(path) {
                $location.path(path);
            }

            //get status avg
            //    statusAvgService.getData();

            //   getCategoryService.getData();
            // _self.category = getCategoryService;
            $scope.msg = msgService;


            //  abilityService.getData();
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


    app.directive("msg", function() {
        return {
            restrict: 'A',
            template: "<p class='{{msg.msgType}}' ><i class='fa {{msg.icon}}'></i> {{msg.msgText}}</p>"
        }

    })

    app.service('abilityService', ['$http', function($http) {
        var _self = this;

        _self.weapon = [];
        _self.character = [];
        _self.mapping = []

        _self.getData = function() {
            $http.post("getData", {
                type: "get_ability"
            }).then(function(response) {
                //console.log(response.data);
                var _d = response.data
                for (var i = 0; i < _d.length; i++) {
                    _self[_d[i].type].push(_d[i]);
                    _self.mapping[_d[i]._id] = _d[i];
                }

            });
        }
    }])

    app.directive('lightBox', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {

                scope.aa = function() {
                    alert("A");
                }

                var aaa = "<button bbb>A</button>";
                var linkFn = $compile(aaa);
                console.log(linkFn);
                var content = linkFn(scope);
                element.append(content);
            }
        }

    })

    app.directive('bbb', function($compile) {

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bind('click',function(){
                    alert("B");
                })    
            }
        }

    })






})
