define(function(require) {

    var app = require("app");

    app.directive("thumbEditBoard", ['lightBoxService', 'settingService', function(lightBoxService, settingService) {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element, attr) {


                var bc = new bannerCreater();

                var _editArea = document.getElementById('editArea');
                var _displayArea = document.getElementById('displayArea');
                var _thumbImgFile = document.getElementById('thumbImgFile');
                var _actorBanner = document.getElementById('actorBanner');
                var _actorthumb = document.getElementById('actorthumb');

                var faction = settingService.categoryMapping[scope.currentCard.faction];

                _actorBanner = angular.element(_actorBanner);
                _actorthumb = angular.element(_actorthumb);
                _thumbImgFile = angular.element(_thumbImgFile);

                _thumbImgFile.bind('change', fileChangeProcess);

                scope.tempBanner = null;
                scope.tempThumb = null;

                scope.mode = 0;
                scope.modeTitle = 'Banner';
                scope.titleMode;

                scope.modeActiveClass = modeActiveClass;
                scope.changeMode = changeMode;
                scope.changeTitleMode = changeTitleMode;
                scope.capture = capture;
                scope.apply = apply;
                scope.cancel = cancel;


                if (faction) {
                    bc.setFaction(faction.title);
                }

                bc.init(_editArea, _displayArea);

                bc.changeSubTitle(scope.currentCard.title);

                if (scope.currentActor.title) {
                    bc.changeTitle(scope.currentActor.title);
                }

                scope.titleMode = bc.titleMode;

                if (scope.thumbImg) {
                    loadImgProcess(scope.thumbImg);
                }

                function modeActiveClass(_type, _mode) {
                    if (_type == 'mode') {
                        if (_mode == scope.mode) {
                            return "active"
                        }
                    } else {
                        if (_mode == scope.titleMode) {
                            return "active"
                        }
                    }
                }

                function fileChangeProcess(event) {
                    var _file = event.target.files[0];
                    var imageType = /image.*/;

                    if (_file.type.match(imageType)) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            loadImgProcess(reader.result);
                        }
                        reader.readAsDataURL(_file);
                    }
                }

                function changeMode(_mode) {
                    scope.mode = _mode;
                    bc.selectMode(_mode);

                    if (_mode == 0) {
                        scope.modeTitle = "Banner";
                    } else {
                        scope.modeTitle = "Thumb";
                    }
                }

                function changeTitleMode(_mode) {
                    bc.changeTitleMode(_mode);
                    scope.titleMode = _mode;
                }

                function capture() {
                    var imgUrl = bc.exportImg();
                    var _img = document.createElement('IMG');

                    _img.src = imgUrl;
                    if (bc.mode == 0) {
                        _actorBanner.empty();
                        _actorBanner.append(_img);
                        scope.tempBanner = imgUrl;
                    } else {
                        _actorthumb.empty();
                        _actorthumb.append(_img);
                        scope.tempThumb = imgUrl;
                    }
                }

                function apply() {

                    if (!scope.currentActor.newImg) {
                        scope.currentActor.newImg = {
                            banner: null,
                            thumb: null
                        }
                    }

                    if (scope.tempBanner) {
                        scope.currentActor.newImg.banner = scope.tempBanner;
                        scope.currentActor.showImg.banner = scope.tempBanner;
                    }

                    if (scope.tempThumb) {
                        scope.currentActor.newImg.thumb = scope.tempThumb;
                        scope.currentActor.showImg.thumb = scope.tempThumb;
                    }

                    lightBoxService.close();
                }

                function cancel(_mode) {
                    if (_mode == 0) {
                        _actorBanner.empty();
                        scope.tempBanner = null;
                    } else {
                        _actorthumb.empty();
                        scope.tempThumb = null;
                    }
                }

                function loadImgProcess(readerResult) {
                    delete(PIXI.loader.resources['actor']);
                    var loader = PIXI.loader;
                    loader.add('actor', readerResult);
                    loader.once('complete', function() {
                        bc.loadedActor();
                    });
                    loader.load();
                }
            },
            templateUrl: "js/apps/cards/directives/thumb_edit_board.html"
        }
    }])

})
