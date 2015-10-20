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

                var _thumbEdit = new thumbEdit();

                if (scope.currentActor.img.pX && scope.currentActor.img.pY) {
                    _thumbEdit.output = {
                        x: scope.currentActor.img.pX,
                        y: scope.currentActor.img.pY
                    }
                }

                scope.edit = false;
                scope.editText = "Edit Thumb";
                scope.thumbEditReady = false;

                scope.editBtnClick = function() {
                    if (!scope.thumbImg) {
                        return false;
                    }

                    if (!scope.edit) {
                        scope.editText = "Apply"
                        _thumbEdit.init('thumb' + scope.idx, scope.thumbImg, 'thumbs' + scope.idx);

                        scope.edit = true;
                        scope.thumbEditReady = true;
                    } else {
                        scope.currentActor.img.pX = _thumbEdit.output.x;
                        scope.currentActor.img.pY = _thumbEdit.output.y;
                        scope.editText = "Edit thumb"
                        scope.edit = false;
                    }
                }

                scope.$watch('thumbImg', function(_value) {
                    if (_value && scope.thumbEditReady) {
                        _thumbEdit.renew(_value);
                    }
                })

            },
            templateUrl:"js/apps/cards/directives/thumb_images.html"
        }
    })

})
