define(function(require) {

    var app = require("app");

    app.directive("thumbImagesArea", ['$compile',
        'lightBoxService',
        function($compile, lightBoxService) {
            return {
                restrict: 'A',
                scope: {
                    thumbImg: "=thumbImage",
                    currentActor: "=currentActor"
                },
                link: function(scope, element, attr) {

                    scope.openEditBoard = openEditBoard;

                    scope.removeImg = removeImg;


                    function removeImg(_type){
                        scope.currentActor.img[_type]=null;
                        scope.currentActor.newImg[_type]=null;
                       
                    }

                    
                    function openEditBoard() {
                        var _a = $compile("<div thumb-edit-board thumb-images='thumbImg' current-actor='currentActor'></div>")(scope);
                        lightBoxService.open(_a, 720, 520);
                    }


                },
                templateUrl: "js/apps/cards/directives/thumb_images_area.html"
            }

        }
    ])

})
