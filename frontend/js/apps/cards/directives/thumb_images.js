define(function(require) {

    var app = require("app");



    app.directive("thumbImages", function() {
        return {
            restrict: 'A',
            scope: {
                thumbImg: "=thumbImages",
                idx: "@",
                currentActor: "=currentActor"
            },
            transclude: true,
            link: function(scope, element, attr) {

                var bc = new bannerCreater();

                var _editArea = document.getElementById('editArea');
                var _displayArea = document.getElementById('displayArea');
                var _thumbImgFile = document.getElementById('thumbImgFile');
                var _actorBanner = document.getElementById('actorBanner');
                var _actorthumb = document.getElementById('actorthumb');

                var _tempBanner = '';
                var _tempthumb = '';

                scope.mode = 0;
                scope.modeTitle = 'Banner'

                scope.modeActiveClass = function(_mode) {
                    if (_mode == scope.mode) {
                        return "active"
                    }
                }

                _actorBanner = angular.element(_actorBanner);
                _actorthumb = angular.element(_actorthumb);
                _thumbImgFile = angular.element(_thumbImgFile);

                _thumbImgFile.bind('change', function() {
                    var _file = event.target.files[0];
                    var imageType = /image.*/;

                    if (_file.type.match(imageType)) {
                        var reader = new FileReader();

                        reader.onload = function(e) {

                            delete(PIXI.loader.resources['actor']);

                            var loader = PIXI.loader;
                            loader.add('actor', reader.result);
                            loader.once('complete', function() {
                                bc.loadedActor();
                            });
                            loader.load();
                        }
                        reader.readAsDataURL(_file);
                    }
                })

                bc.init(_editArea, _displayArea);

                scope.changeMode = function(_mode) {
                    scope.mode = _mode;
                    bc.selectMode(_mode);

                    if (_mode == 0) {
                        scope.modeTitle = "Banner";
                    } else {
                        scope.modeTitle = "Thumb";
                    }
                }

                scope.changeTitleMode = function(_mode) {
                    bc.changeTitleMode(_mode);
                }

                scope.capture = function() {
                    var imgUrl = bc.exportImg();
                    var _img = document.createElement('IMG');

                    _img.src = imgUrl;
                    if (bc.mode == 0) {
                        _actorBanner.empty();
                        _actorBanner.append(_img);
                        _tempBanner = _img;
                    } else {
                        _actorthumb.empty();
                        _actorthumb.append(_img);
                        _tempthumb = _img;
                    }
                }

                scope.apply = function() {

                }

                scope.cancel = function(_mode) {
                    if (_mode == 0) {
                        _actorBanner.empty();
                        _tempBanner = '';
                    } else {
                        _actorthumb.empty();
                        _tempthumb = '';
                    }
                }
            },
            templateUrl: "js/apps/cards/directives/thumb_images.html"
        }
    })

})
