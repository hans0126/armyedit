define(function(require) {

    var app = require("app");

    app.controller("laboratory_controller", [
        function() {


        }
    ])

    app.directive('lightBox', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {

                scope.aa = function() {
                    alert("A");
                }

                var aaa = "<button bbb>A</button>";
                var linkFn = $compile(aaa);

                var content = linkFn(scope);
                element.append(content);
            }
        }

    })

    // a content to b content 
    // can lighbox  prototype


    app.directive('aa', function($compile, $sce) {
        return {

            restrict: 'A',
            //        terminal: true, // when duplicated object, it will bind twice event. must active terminal
            link: function(scope, element, attr) {


                scope.bbsa = function() {
                    console.log("S");
                }


                scope.callBox = function() {

                    var s = element.find('h2')[0]; //get innerHTML 
                    if (s) {
                        s.remove();
                        var n = document.getElementById('bbb'); //get element
                        n = angular.element(n); // covert to angular element

                        n.html(s.outerHTML); //can't use jq-lite obj 
                        $compile(n)(scope);
                    }

                    /*  
                                     
                                        element.children().remove();
                                        var n = document.getElementById('bbb'); //get element

                                        n = angular.element(n); // covert to angular element



                                        n.html("<div id='bbb'>" + s + "</div>"); //can't use jq-lite obj 
                                        $compile(n)(scope);
                                     
                                        */


                }


            },
            template: "<h2 ng-click='bbsa()'>1qaz</h2><button class='btn' ng-click='callBox()'>test</button>"

        }

    })

})
