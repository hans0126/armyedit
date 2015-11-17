define(function(require) {

    var app = require("app");

    app.directive("warbeastEditor", [
        function() {


            return {
                restrict: 'A',
                scope: {
                    currentActor: "=currentActor"
                },
                link: function(scope, element, attr) {
                    scope.changeNum = changeNum;
                    changeNum();
                    function changeNum() {
                        var _count = 0;
                        for (var key in scope.currentActor.hp.warbeast_detail) {
                            _count += scope.currentActor.hp.warbeast_detail[key];
                        }

                        scope.currentActor.hp.count = _count
                    }
                },
                templateUrl: "js/apps/cards/directives/warbeast_editor.html"
            }
        }
    ])

})
