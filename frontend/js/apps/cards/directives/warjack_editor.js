define(function(require) {

    var app = require("app");

    app.directive("warjackEditor", ['$compile',
        'lightBoxService',
        function($compile, lightBoxService) {
            return {
                restrict: 'A',
                scope: {
                    currentActor: "=currentActor",
                    currentCard: "=currentCard"
                },
                link: function(scope, element, attr) {
                    scope.openWarjackEditor = openWarjackEditor;

                    function openWarjackEditor() {
                        var _a = $compile("<div warjack-editor-board style='width:600px'></div>")(scope);
                        lightBoxService.open(_a, 720, 520);
                    }

                },
                templateUrl: "js/apps/cards/directives/warjack_editor.html"
            }

        }
    ])


    app.directive("warjackEditorBoard", ['lightBoxService', function(lightBoxService) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var warjackEditArea = document.getElementById('warjackEditArea');
                var currentDisplayMode;
                var currentBrush;
                var wj = new warjackBox();

                wj.init(warjackEditArea);

                scope.getBrush = getBrush;
                scope.changeDisplayMode = changeDisplayMode;
                scope.activeClass = activeClass;
                scope.resetAll = resetAll;
                scope.mirrorMode = false;
                scope.lrBind = true;
                scope.mcBind = true;
                scope.changeMirrorMode = changeMirrorMode;

                function getBrush(_b) {
                    currentBrush = _b;
                    wj.getBrush(_b);
                }

                function changeDisplayMode(_mode) {
                    currentDisplayMode = _mode;
                    wj.changeMode(_mode, function() {
                         scope.lrBind = wj.LRbind;
                         scope.mcBind = wj.MCbind;
                    });
                }

                function activeClass(_currentValue, _type) {
                    // displayMode,brush
                    var va;
                    switch (_type) {
                        case "displayMode":
                            va = currentDisplayMode;
                            break;

                        case "brush":
                            va = currentBrush;
                            break;
                    }

                    if (_currentValue == va) {
                        return "active"
                    }
                }

                function resetAll() {
                    wj.resetTable();
                }

                function changeMirrorMode(_type) {
                    // mirror,lrBind,mcBind
                    switch (_type) {
                        case "mirror":
                            !scope.mirrorMode;
                            wj.mirrorMode = scope.mirrorMode;
                            break;
                        case "lrBind":
                            !scope.lrBind;
                            wj.LRbind = scope.lrBind;
                            break;
                        case "mcBind":
                            !scope.mcBind;
                            wj.MCbind = scope.mcBind;
                            break;
                    }
                }
            },
            templateUrl: "js/apps/cards/directives/warjack_editor_board.html"
        }
    }])

})
