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
            _self.getAbilityIcon = getAbilityIcon;
            _self.colWidth = colWidth;
            _self.popupShow = true;
            _self.compareStart = compareStart;
            _self.openSearchPanel = openSearchPanel;
            _self.bestStatus = null;
            _self.bestValueStyle = bestValueStyle;

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

                compareValue();


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

                compareValue();
            }

            function compareStart() {
                _self.popupShow = false;
            }

            function openSearchPanel() {
                _self.popupShow = true;
            }


            function getAbilityIcon(_id) {
                return ["sprite", settingService.abilityMapping[_id].cssClass]
            }

            function colWidth() {
                var _w = (100 / (_self.compareBox.length + 1)) + "%";

                return {
                    width: _w
                }
            }

            function compareValue() {
                if (_self.compareBox.length <= 1) {
                    return
                }

                _self.bestStatus = {
                    values: [],
                    best: []
                };

                for (var i = 0; i < _self.compareBox.length; i++) {
                    //basic status
                    var _card = _self.compareBox[i].card.actor[_self.compareBox[i].actorIndex];
                  
                    for (var key in _card.status) {
                        if (!_self.bestStatus.values[key]) {
                            _self.bestStatus.values[key] = [];
                            _self.bestStatus.best[key] = [];
                        }
                        _self.bestStatus.values[key].push({
                            value: _card.status[key],
                            idx: i
                        });
                    }

                      if (!_self.bestStatus.values['life']) {
                            _self.bestStatus.values['life'] = [];
                            _self.bestStatus.best['life'] = [];
                        }

                      _self.bestStatus.values['life'].push({
                            value: _card.hp.count,
                            idx: i
                        });

                    //life
                }

                //comapre

                for (var key in _self.bestStatus.values) {
                    _self.bestStatus.values[key].sort(function(a, b) {
                        return b.value - a.value
                    })

                    var _bestSingleValue = _self.bestStatus.values[key][0].value;

                    if (_bestSingleValue != null) {

                        for (var i = 0; i < _self.bestStatus.values[key].length; i++) {
                            if (_self.bestStatus.values[key][i].value === _bestSingleValue) {
                                _self.bestStatus.best[key].push(_self.bestStatus.values[key][i].idx);
                            }
                        }
                    }
                }

            }


            function bestValueStyle(_idx, _key) {
                if (!_self.bestStatus) {
                    return
                }

                if (_self.bestStatus.best[_key].indexOf(_idx) >= 0) {
                    return "bg-info"
                }
            }

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

                compareBtnGroup = svg.append('g').classed('compareBtnGroup', true).attr('id', 'chartBtnGroup');

                $scope.$watch('selected.length', function(cardCount) {
                    compareBtnGroup.html("");
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

                        for (var i = 0; i < $scope.selected.length; i++) {
                            var _card = $scope.selected[i].card;
                            var _idx = $scope.selected[i].actorIndex;
                            var strokeColor = svg.select('polygon.chart_style_' + i).style("stroke");

                            var _gBtn = compareBtnGroup
                                .append('g')
                                .attr("transform", "translate(" + "0," + (i * 20) + ")")
                                .on('click', function(e) {

                                    var _v;
                                    if (typeof(this.hide) == "undefined") {
                                        this.hide = false;
                                    } else {
                                        this.hide = !this.hide;
                                    }

                                    if (this.hide) {
                                        _v = "visible";
                                    } else {
                                        _v = "hidden";
                                    }

                                    svg.select('.chart_style_' + d3.select(this).attr('idx')).attr("visibility", _v);

                                })
                                .attr('id', "chart_style_" + i)
                                .attr('idx', i);

                            _gBtn.append('rect')
                                .attr('width', 20)
                                .attr('height', 10)
                                .attr('fill', strokeColor);

                            _gBtn.append('text')
                                .text(_card.actor[_idx].title)
                                .attr('dy', "1em")
                                .attr('x', 25)
                                .style({
                                    "font-size": "12px",
                                    "z-index": "999999999"
                                });


                        }



                    } else {
                        svg.selectAll("polygon.area").remove();
                    }


                })

            }

        }

    }])








})
