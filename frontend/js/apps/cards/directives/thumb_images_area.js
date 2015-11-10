define(function(require) {

    var app = require("app");

    app.directive("thumbImagesArea", ['$compile',
        'lightBoxService',
        function($compile, lightBoxService) {
            return {
                restrict: 'A',
                scope: {
                    thumbImg: "=thumbImage",
                    currentActor: "=currentActor",
                    currentCard: "=currentCard"
                },
                link: function(scope, element, attr) {
                    scope.openEditBoard = openEditBoard;
                    scope.removeImg = removeImg;


                    function removeImg(_type) {
                        scope.currentActor.img[_type] = null;
                        scope.currentActor.showImg[_type] = null;
                        if (scope.currentActor.newImg) {
                            scope.currentActor.newImg[_type] = null;
                        }
                    }

                    function openEditBoard() {
                        if(!scope.currentCard.faction || !scope.currentCard.title) return;

                        var _a = $compile("<div thumb-edit-board></div>")(scope);
                        lightBoxService.open(_a, 720, 520);
                    }
                },
                templateUrl: "js/apps/cards/directives/thumb_images_area.html"
            }

        }
    ])

})
