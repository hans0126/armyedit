define(function(require) {

    var app = require("app");

    app.controller("laboratory_controller", ['settingService', '$compile', '$scope', 'll',function(settingService, $compile, $scope,ll) {
        var _self = this;
        _self.s = settingService

        // console.log(_self.s);
        _self.ba = "AAAASDDSD"

        var bb = document.getElementById('b');
        var body = document.getElementsByTagName('body');

        body = angular.element(body);
        bb = angular.element(bb);
        /*lightBox = angular.element(lightBox);


        lightBox.bind('click',function(){
            console.log("A");
        })
*/

        var c = $compile("<div hehe s='lab.ba'></div>")($scope);

        _self.addTest = function() {
            bb.append(c);
            body.addClass('lightBoxFixed');
            ll.show = true;
        }

        _self.removeTest = function() {
            bb.empty();
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

                var content = linkFn(scope);
                element.append(content);
            }
        }

    })


    app.directive('hehe', function() {

        return {
            restrict: 'A',
            scope: {
                s: '=s'
            },
            link: function(scope, element, attr) {
                scope.rere = function() {
                    scope.s = "OK";
                }
            },
            template: "<div>{{s}}</div><button class='btn btn-primary' ng-click='rere()'>reTurn</button>"
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
        /*
            app.directive('radar', function(radarFactory) {

                return {
                    restrict: 'A',
                    scope: {
                        avg: "=avg"
                    },
                    link: function(scope, element, attr) {

                        var chart = new RadarChart.chart();

                        chart.config({
                            w: 200,
                            h: 200,
                            maxValue: 100
                        }); // retrieve default config
                        var svg = d3.select(element[0]).append('svg').style({
                            height: '200px'
                        });

                        var watcher = scope.$watch('avg.statusMapping', function(_a, _b) {
                            if (_a) {
                                var _d = radarFactory("A", status, scope.avg);
                                svg.append('g').classed('single', true).datum([_d]).call(chart);
                              
                            }

                        })

                        var status = {
                            spd: 13,
                            arm: 10,
                            mat: 10,
                            rat: 10,
                            cmd: 10
                        }

                    }

                }
            })

        **/

})
