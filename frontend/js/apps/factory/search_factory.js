define(function(require) {

    var app = require("app");

    app.factory('search', function() {

        var itemSearch = {
            http: null,
            scope: null,
            pageshow: 9,
            currentPage: 0,
            totalPageCount: 0,
            totalItemCount: 0,
            returnArmy: [],
            status_avg: {},
            selectGroup: {
                series: {
                    data: null,
                    default_value: null,
                    selected_value: null
                },
                faction: {
                    data: null,
                    default_value: null,
                    selected_value: null
                },
                category: {
                    data: null,
                    default_value: null,
                    selected_value: null
                }
            },
            keyword: {
                default_value: "",
                selected_value: null
            },
            seriesSelect: function($http) {

                if (this.selectGroup.series.default_value != null) {
                    this.http.post("getData", {
                        type: "faction",
                        id: this.selectGroup.series.default_value._id
                    }).then(function(response) {
                        this.selectGroup.faction = {
                            data: response.data
                        }
                    }.bind(this))

                    this.http.post("getData", {
                        type: "category",
                        id: this.selectGroup.series.default_value._id
                    }).then(function(response) {
                        this.selectGroup.category = {
                            data: response.data
                        }
                    }.bind(this))
                }
            },
            init: function() {
                this.http.post("getData", {
                    type: "series"
                }).then(function(response) {
                    this.selectGroup.series = {
                        data: response.data
                    }

                }.bind(this))
            },
            search: function(_newSearch) {

                if (typeof(_newSearch) != "undefined") {
                    this.currentPage = 0;
                    this.totalPageCount = 0;
                    this.totalItemCount = 0;
                }

                var searchQuery = {
                    type: "search",
                    pageshow: this.pageshow,
                    currentPage: this.currentPage
                }

                for (var key in this.selectGroup) {
                    searchQuery[key] = this.selectGroup[key].selected_value = (this.selectGroup[key].default_value == null) ? null : this.selectGroup[key].default_value._id;

                }

                searchQuery.keyword = this.keyword.selected_value = (this.keyword.default_value == "") ? null : this.keyword.default_value;

                this.http.post("getData", searchQuery).then(function(response) {
                    this.returnArmy = response.data.data;
                    this.totalItemCount = response.data.count;
                    this.totalPageCount = Math.floor(response.data.count / this.pageshow);
                    this.status_avg = response.data.status_avg
                    this.scope.searchReturn = response.data.data;

                    if (response.data.count % this.pageshow > 0) {
                        this.totalPageCount++;
                    }


                }.bind(this))


            },
            prev: function() {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.search();
                }


            },
            next: function() {
                if (this.currentPage < this.totalPageCount - 1) {
                    this.currentPage++;
                    this.search();
                }
            }
        }

        return itemSearch;


    })

    app.factory('radar', function() {

        var _data = []

        var _orignal_data = {
            className: 'hide', // optional can be used for styling
            axes: [{
                axis: "SPD",
                value: 1,
                yOffset: -10
            }, {
                axis: "STR",
                value: 1,
                yOffset: -10,
                xOffset: -10
            }, {
                axis: "MAT",
                value: 1,
                yOffset: 10,
                xOffset: -10
            }, {
                axis: "RAT",
                value: 1,
                yOffset: 10
            }, {
                axis: "DEF",
                value: 1,
                yOffset: 10,
                xOffset: 10
            }, {
                axis: "ARM",
                value: 1,
                yOffset: -10,
                xOffset: 10
            }]
        }

        _data.push(_orignal_data);

        var radarTemp = {
            data: _data,
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            render: function(target) {
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            },
            transferData: function(_data) {

                var _to = angular.copy(this.orignal_data);

                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key];
                            break;
                        }
                    }
                }
                return _to;
            }
        }

        return radarTemp;



    })


    app.factory('itemSelect', function() {
            //console.log( $scope.itemSearch);

            var _obj = {

                onSelect: function(scope, element) {


                    for (var i = 0; i < scope.itemSearch.returnArmy.length; i++) {
                        if (scope.itemSearch.returnArmy[i]._id == element.attr('_id')) {
                            console.log( scope);
                            scope.currentProduct = scope.itemSearch.returnArmy[i];
                           
                        // console.log(scope.currentSelectedUnit);

                        /*
                        scope.$parent.currentSelectedUnit = scope.itemSearch.returnArmy[i];

                        if (typeof(scope.itemSearch.returnArmy[i].status) != "undefined") {

                            var test = {
                                className: 'hide', // optional can be used for styling
                                axes: [{
                                    axis: "SPD",
                                    value: scope.itemSearch.status_avg.spd * 10,
                                    yOffset: -10
                                }, {
                                    axis: "STR",
                                    value: scope.itemSearch.status_avg.str * 10,
                                    yOffset: -10,
                                    xOffset: -10
                                }, {
                                    axis: "MAT",
                                    value: scope.itemSearch.status_avg.mat * 10,
                                    yOffset: 10,
                                    xOffset: -10
                                }, {
                                    axis: "RAT",
                                    value: scope.itemSearch.status_avg.rat * 10,
                                    yOffset: 10
                                }, {
                                    axis: "DEF",
                                    value: scope.itemSearch.status_avg.def * 10,
                                    yOffset: 10,
                                    xOffset: 10
                                }, {
                                    axis: "ARM",
                                    value: scope.itemSearch.status_avg.arm * 10,
                                    yOffset: -10,
                                    xOffset: 10
                                }]
                            }

                            var _data = [];


                            _data.push(scope.radar.transferData(scope.itemSearch.returnArmy[i].status));
                            _data.push(test);
                            scope.radar.data = _data;

                            scope.radar.render();

                        }

                        scope.$apply();*/
                           // scope.$apply();  
                        break;
                    }
                }
            }

        }





        return _obj

    })



})
