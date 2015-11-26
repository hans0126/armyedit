define(function(require) {

    var app = require("app");

    app.controller("compare_controller", ["$scope",
        "searchTypeService",
        "settingService",
        function($scope, stService, settingService) {

            var _self = this;

            stService.searchBtnShow = false //select btn visible
            stService.searchType = "card" //cards or priducts   

            _self.s = settingService;

            _self.getFlagName = getFlagName;

            _self.selctedCard = null;

            _self.thumbCss = thumbCss;
            _self.selectItem = selectItem;

            _self.removeCompareItem = removeCompareItem;

            _self.compareBox = [];

            _self.popupShow = true;
            _self.compareStart = compareStart;

            stService.objectSelected = function(obj) {
                _self.selctedCard = obj;
                for (var i = 0; i < _self.compareBox.length; i++) {
                    if (_self.compareBox[i].card._id == obj._id) {
                        if (obj.actor[_self.compareBox[i].actorIndex]) {
                            obj.actor[_self.compareBox[i].actorIndex].selected = true;
                        } else {
                            obj.actor[_self.compareBox[i].actorIndex].selected = false;
                        }
                    }
                }
            }


            function thumbCss(_obj, _actor) {
                return {
                    "background": "url(products/normal/" + _obj.image_name + ")",
                    "background-position": _actor.img.pX + "px " + _actor.img.pY + "px"
                }
            }

            function selectItem(_obj, _actorIdx) {

                var dup = checkTheSame(_obj, _actorIdx);

                if (dup > -1) {
                    _self.compareBox.splice(dup, 1);
                    _obj.actor[_actorIdx].selected = false;
                } else {
                    if (_self.compareBox.length < 3) {
                        _self.compareBox.push({
                            card: _obj,
                            actorIndex: _actorIdx
                        })

                        _obj.actor[_actorIdx].selected = true;
                    }
                }


                function checkTheSame(_tobj, _tidx) {
                    var result = -1;
                    for (var i = 0; i < _self.compareBox.length; i++) {
                        if (_self.compareBox[i].card._id == _tobj._id && _self.compareBox[i].actorIndex == _tidx) {
                            result = i;
                            break;
                        }
                    }
                    return result;
                }
            }

            function getFlagName(_obj) {
                var _r = settingService.categoryMapping[_obj];
                if (_r) {
                    return _r.title
                }
            }

            function removeCompareItem(_obj) {
                for (var i = 0; i < _self.compareBox.length; i++) {
                    if (_self.compareBox[i].card._id == _obj.card._id) {
                        _self.compareBox.splice(i, 1);
                        break;
                    }
                }


                if (_self.selctedCard._id == _obj.card._id) {
                    _self.selctedCard.actor[_obj.actorIndex].selected = false;
                }
            }

            function compareStart() {
                _self.popupShow = false;
            }


            /*
            _self.search = search;

            _self.search.init();

            _self.selected = [];
       
            _self.statusAvg = statusAvgService;
          
            search.itemSelect = function(_obj) {

                if (_self.selected.length >= 3) return false;

                var _exists = false;
                for (var i = 0; i < _self.selected.length; i++) {
                    if (_self.selected[i]._id == _obj._id) {
                        _exists = true;
                        break;
                    }
                }

                if (!_exists) {
                    _self.selected.push(_obj);
                   
                }
            }

            _self.statusAvgService = statusAvgService;

            _self.searchBtn = {
                text: "open",
                open: false,
                trigger: function() {
                    if (this.open) {
                        this.text = "open";
                    } else {
                        this.text = "close";
                    }

                    this.open = !this.open;

                }
            }
            */

        }
    ])

    app.directive("smallRadar", ["radarFactory", function(radarFactory) {

        return {
            restrict: 'A',
            scope: {
                status: "=status"
            },
            link: function($scope, $element, $attr) {

                var _d = [];
                if (typeof($scope.status) != "undefined") {
                    _d.push(radarFactory('a', $scope.status));
                }

                var chart = new RadarChart.chart();

                chart.config({
                    w: 150,
                    h: 150,
                    maxValue: 100,
                    circles: false
                }); // retrieve default config

                var svg = d3.select($element[0]).append('svg').style({
                    height: '150px',
                    width: '150px'
                });

                svg.append('g').classed('single', true).datum(_d).call(chart);

            }

        }

    }])



    app.directive("compareRadar", ["radarFactory", function(radarFactory) {

        return {
            restrict: 'A',
            scope: {
                selected: "=selected"
            },
            link: function($scope, $element, $attr) {

                var chart = new RadarChart.chart();

                chart.config({
                    w: 350,
                    h: 350,
                    maxValue: 100,
                    circles: false
                }); // retrieve default config

                var svg = d3.select($element[0]).append('svg').style({
                    height: '350px',
                    width: '350px'
                });

                svg.append('g').classed('single', true);

                $scope.$watch('selected.length', function(cardCount) {
                    var _d = [];
                    if (cardCount > 0) {

                        for (var i = 0; i < $scope.selected.length; i++) {
                            var _card = $scope.selected[i].card;
                            var _idx = $scope.selected[i].actorIndex;

                            if (typeof(_card.actor[_idx].status) != "undefined") {
                                _d.push(radarFactory("chart_style_" + i, _card.actor[_idx].status));
                            }
                        }

                        svg.datum(_d).call(chart);

                      /*  svg.append("circle")
                            .attr("r", 100)
                            .on('click', function() {
                                console.log(svg.selectAll('polygon.chart_style_0').style("stroke"));
                                //svg.selectAll('.chart_style_0').style.stroke;

                            });*/
                    } else {
                        svg.selectAll("polygon").remove();
                    }


                })

            }

        }

    }])








})
