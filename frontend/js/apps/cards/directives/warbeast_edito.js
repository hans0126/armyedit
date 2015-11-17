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
                    function changeNum(elem){
                        console.log("A");
                        console.log(elem.value);
                    }  
                },
                templateUrl: "js/apps/cards/directives/warbeast_editor.html"
            }
        }
    ])

})
